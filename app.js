import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import passport from "passport";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localMiddleware } from "./middlewares";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import routes from "./routes";
import "./passport";

// build
const app = express();
app.set("view engine", "pug"); // pug view

const CookieStore = MongoStore(session);

// middleWare
app.use(helmet()); // security
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));

app.use(cookieParser()); // client->server cookie parsing
app.use(bodyParser.json()); // client->server http post body parsing(json type..)
app.use(bodyParser.urlencoded({ extended: true })); // client->server http post body parsing(form..)
app.use(morgan("dev")); // logging
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new CookieStore({ mongooseConnection: mongoose.connection })
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(localMiddleware);

// router
app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

export default app;
