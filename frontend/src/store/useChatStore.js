import { create } from "zustand";
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";


const notificationSound=new Audio("/sounds/notification.mp3");
export const useChatStore = create((set,get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) =>
    set((state) => ({
      selectedUser,
      chats: state.chats.map((c) => (c._id === selectedUser._id ? { ...c, unreadCount: 0 } : c)),
    })),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },


getMessagesByUserId:async(userId)=>{
  set({isMessagesLoading:true});

  try{

    const res = await axiosInstance.get(`/messages/${userId}`);
    set({ messages:res.data});
  }catch(error){
    toast.error(error.response?.data?.message||"Something went wrong");
  }finally{
    set({isMessagesLoading:false})
  }

},

sendMessage:async(messageData)=>{

  const {selectedUser,messages}=get();
 const {authUser}= useAuthStore.getState();

 const tempId=`temp-${Date.now()}`;

 const optimisticMessage={
  _id:tempId,
  senderId:authUser._id,
  receiverId:selectedUser._id,
  text:messageData.text,
  image:messageData.image,
  createdAt:new Date().toISOString(),
  isOptimistic:true,//flag to identify optimistic messages (optional)

 };

  set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: messages.concat(res.data) });
    } catch (error) {
      // remove optimistic message on failure
      set({ messages: messages });
      toast.error(error.response?.data?.message || "Something went wrong");
    }
},


  subscribeToMessages:()=>{
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage",(newMessage)=>{
      const { selectedUser, isSoundEnabled } = get();
      const currentMessages = get().messages;

      // Only append the incoming message if it belongs to the currently open chat
      if (selectedUser && (newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser._id)) {
        set({ messages: [...currentMessages, newMessage] });
        // Update chat entry for the selected user as lastMessage (optional)
        set((state) => ({
          chats: state.chats.map((c) => (c._id === (newMessage.senderId === selectedUser._id ? newMessage.senderId : newMessage.receiverId) ? { ...c, lastMessage: newMessage } : c)),
        }));
      } else {
        // Message belongs to another chat: update chats list (lastMessage / unreadCount)
        set((state) => ({
          chats: state.chats.map((c) => {
            if (c._id === newMessage.senderId) {
              return { ...c, lastMessage: newMessage, unreadCount: (c.unreadCount || 0) + 1 };
            }
            return c;
          }),
        }));
      }

      if (isSoundEnabled) {
        notificationSound.currentTime = 0; //reset to start
        notificationSound.play().catch((e) => console.log("Audio play failed:", e));
      }
    })
  },

  unsubscribeFromMessages: ()=>{
    const socket =useAuthStore.getState().socket;
    socket.off("newMessage");
  },

}));