import axios from "axios";


export const axiosInstance= axios.create({
    baseURL:impoer.meta.env.MODE==="development" ? "http://localhost:3000/api":"/api",
    withCredentials:true,
})