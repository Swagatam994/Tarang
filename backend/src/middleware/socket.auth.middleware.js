import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    // extract token from http-only cookies or Authorization header
    let token = socket.handshake.headers.cookie
      ?.split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];
    
    console.log("Socket auth - cookie token:", !!token);
    
    // If no cookie token, try Authorization header (for Google OAuth)
    if (!token) {
      const authHeader = socket.handshake.headers.authorization;
      console.log("Socket auth - authHeader:", authHeader);
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }
    
    // If still no token, try socket.io auth object
    if (!token && socket.handshake.auth?.token) {
      token = socket.handshake.auth.token;
      console.log("Socket auth - found token in auth object");
    }

    console.log("Socket auth - final token:", !!token);

    if (!token) {
      console.log("Socket connection rejected: No token provided");
      return next(new Error("Unauthorized - No Token Provided"));
    }

    // verify the token
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    console.log("Socket auth - decoded:", decoded);
    if (!decoded) {
      console.log("Socket connection rejected: Invalid token");
      return next(new Error("Unauthorized - Invalid Token"));
    }

    // find the user fromdb
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("Socket connection rejected: User not found");
      return next(new Error("User not found"));
    }

    // attach user info to socket
    socket.user = user;
    socket.userId = user._id.toString();

    console.log(`Socket authenticated for user: ${user.fullName} (${user._id})`);

    next();
  } catch (error) {
    console.log("Error in socket authentication:", error.message);
    next(new Error("Unauthorized - Authentication failed"));
  }
};
