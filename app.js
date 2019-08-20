import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

//build
const app = express();

//business
const handleHome = (req,res) =>  res.send("Hello from home");
const handleProfile = (re,res) => res.send("You are on my profile");

//middleWare
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(helmet());
app.use(morgan("dev"));

//routing
app.get("/",handleHome);
app.get("/profile",handleProfile);
