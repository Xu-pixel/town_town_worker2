import { Router, Status } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { SessionGuard } from "../Middlewares.ts";
import { Comment, CommentModel } from "../models/Comment.ts";
import { UserModel } from "../models/User.ts";


const router = new Router();
export default router;

router
  .get(
    "/user/:uid", //按id查询别人对他的评论
    async (ctx) => {
      ctx.response.body = await CommentModel.find({ receiver: ctx.params.uid }).exec()
    }
  )
  .get(
    "/order/:rid",
    async (ctx) => {
      ctx.response.body = await CommentModel.find({ order: ctx.params.rid }).exec()
    }
  )
  .post(
    "/",
    async (ctx) => {

    }
  )