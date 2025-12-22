import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import { ENV } from "./lib/env.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
const app = express();

// Parse JSON and URL-encoded bodies before route handlers
app.use(express.json()); // populate req.body for JSON
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

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
  connectDB();
});
