import mongoose from "mongoose";

export const connectDB=async () => {
    try {
       const conn=await mongoose.connect(process.env.MONGO_URI);
       console.log("Mongodb connected",conn.connection.host)
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);//1 status code means fail,0means success
    }
}

