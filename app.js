import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { localMiddleware } from "./middlewares";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import routes from "./routes";

// build
const app = express();

// middleWare
app.use(helmet()); // security
app.set("view engine", "pug"); // pug view
app.use("/uploads", express.static("uploads"));

app.use(cookieParser()); // client->server cookie parsing
app.use(bodyParser.json()); // client->server http post body parsing(json type..)
app.use(bodyParser.urlencoded({ extended: true })); // client->server http post body parsing(form..)
app.use(morgan("dev")); // logging

app.use(localMiddleware);

// router
app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

export default app;
