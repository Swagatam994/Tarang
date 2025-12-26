import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import {
  signup,
  login,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { ENV } from "../lib/env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";
const authRouter = express.Router();

// Apply arcjet only to signup and login routes
authRouter.post("/signup", arcjetProtection, signup);
authRouter.post("/login", arcjetProtection, login);

// Google OAuth routes - no arcjet protection (Google handles security)

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    try {
      const token = jwt.sign(
        { userId: req.user._id },
        ENV.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.redirect(`${ENV.CLIENT_URL}/auth-success?token=${token}`);
    } catch (error) {
      console.error("Google login error:", error);
      res.redirect(`${ENV.CLIENT_URL}/login?error=google_failed`);
    }
  }
);
authRouter.get("/me", socketAuthMiddleware, (req, res) => {
  res.json({ success: true, user: req.user });
});


authRouter.post("/logout", logout);

authRouter.put("/update-profile", protectRoute, updateProfile);

authRouter.get("/check", protectRoute, (req, res) =>
  res.status(200).json(req.user)
);

export default authRouter;
