import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js"
const app=express();
dotenv.config();

// Parse JSON and URL-encoded bodies before route handlers
app.use(express.json()); // populate req.body for JSON
app.use(express.urlencoded({ extended: true })); // populate req.body for form submissions

const PORT=process.env.PORT;

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

app.use(express.json());//req.body
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("*",(_,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    });
}

app.listen(PORT,()=>{console.log(`server running on http://localhost:${PORT}`)
connectDB()});
