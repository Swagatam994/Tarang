import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";

import { ENV } from "./env.js";
import User from "../models/User.js";


passport.use(new GoogleStrategy({
    clientID: ENV.GOOGLE_CLIENT_ID,
    clientSecret: ENV.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
 async(accessToken, refreshToken, profile, cb) =>{
    console.log(profile);
    try{
       const email = profile.emails?.[0]?.value?.toLowerCase();
       // Find an existing user by googleId OR email to avoid duplicates
       let user = await User.findOne({ $or: [{ googleId: profile.id }, { email }] });

       if (!user) {
         user = await User.create({
           googleId: profile.id,
           fullName: profile.displayName,
           email,
           avatar: profile.photos?.[0]?.value || "",
         });
       } else if (!user.googleId) {
         // Link the Google account to the existing user
         user.googleId = profile.id;
         if (!user.fullName) user.fullName = profile.displayName;
         if (!user.avatar) user.avatar = profile.photos?.[0]?.value || "";
         await user.save();
       }

       return cb(null, user);
    }catch(err){
        return cb(err,null)
    }
    
  }
));