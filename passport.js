import passport from "passport";
import User from "./models/User";

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser()); //cookie?
passport.deserializeUser(User.deserializeUser()); //사용자 식별
