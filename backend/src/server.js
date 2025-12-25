import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import { ENV } from "./lib/env.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { app ,server} from "./lib/socket.js";

// Parse JSON and URL-encoded bodies before route handlers
app.use(express.json({limit:"5mb"})); // populate req.body for JSON
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}));
app.use(express.urlencoded({ extended: true })); // populate req.body for form submissions

const PORT = ENV.PORT;

app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.use(express.json()); //req.body
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
  connectDB();
});
