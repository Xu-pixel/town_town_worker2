import { Router, Status } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { SessionGuard } from "../Middlewares.ts";
import { ApplyModel } from "../models/Apply.ts";
import { CommentModel } from "../models/Comment.ts";



const router = new Router();
export default router;

router
  .get(
    "/user/:uid", //按id查询别人对他的评论
    async (ctx) => {
      ctx.response.body = await CommentModel.getCommentsByReceiver(ctx.params.uid)
    }
  )
  .get(
    "/order/:rid",
    async (ctx) => {
      ctx.response.body = await CommentModel.getCommentsByOrder(ctx.params.rid)
    }
  )
  .post(
    "/",
    SessionGuard,
    async (ctx) => {
      const body = await ctx.request.body().value
      body.author = ctx.state.userId
      ctx.response.body = await CommentModel.create(body)
    }
  )
  .post(
    "/all", //雇主批量评论
    SessionGuard,
    async (ctx) => {
      const body = await ctx.request.body().value
      body.author = ctx.state.userId
      const applies = await ApplyModel.find({
        order: body.order,
        status: "已通过"
      })
      for (const apply of applies) {
        await CommentModel.create({
          ...body,
          receiver: apply.worker
        })
      }
      ctx.response.body = await CommentModel.create(body)
    }
  )