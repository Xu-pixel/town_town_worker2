import mongoose from "npm:mongoose@~6.7.2";
import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { CORS } from "https://deno.land/x/oak_cors@v0.1.1/mod.ts";
import { ErrorHandler, Logger, Timer } from "./Middlewares.ts";
import "https://deno.land/std@0.177.0/dotenv/load.ts";
import UserRoute from "./routes/user.ts";
import OrderRoute from "./routes/order.ts";
import ImageRoute from "./routes/image.ts";
import MessageRoute from "./routes/message.ts";
import CommentRoute from "./routes/comment.ts";
import ApplyRoute from "./routes/apply.ts";

await mongoose.connect(
  Deno.env.get("MONGO_URL") || "mongodb://localhost:27017",
);
const app = new Application();

//注意各个服务的注册顺序
app.use(CORS());
app.use(Logger);
app.use(Timer);
app.use(ErrorHandler);
app.use(UserRoute.prefix("/user").routes());
app.use(OrderRoute.prefix("/order").routes());
app.use(ImageRoute.prefix("/image").routes());
app.use(MessageRoute.prefix("/message").routes());
app.use(CommentRoute.prefix("/comment").routes());
app.use(ApplyRoute.prefix("/apply").routes());
console.log("Oak 服务器工作在 http://localhost:8000");

await app.listen({ port: 8000 });
