import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB=async () => {
    try {
       const conn=await mongoose.connect(ENV.MONGO_URL);
       console.log("Mongodb connected",conn.connection.host)
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);//1 status code means fail,0means success
    }
}

