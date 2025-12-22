import express from "express";
import { signup } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.get("/login", (req, res) => {
  res.send("login");
});
authRouter.get("/logout", (req, res) => {
  res.send("logout");
});
export default authRouter;