import { Router, Status } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { SessionGuard } from "../Middlewares.ts";
import { Order, OrderModel } from "../models/Order.ts";
import { UserModel } from "../models/User.ts";
import { MessageModel } from "../models/Message.ts";
import mongoose from "npm:mongoose@~6.7.2";
import { ApplyModel } from "../models/Apply.ts";


const router = new Router();
export default router;


router
  .post(
    "/",
    SessionGuard,
    async ({ request, response, state }) => {
      const orderForm: Order = await request.body().value
      orderForm.owner = new mongoose.Types.ObjectId(state.userId)
      response.body = await OrderModel.create(orderForm)
    }
  )
  .put(
    "/:rid", //修改订单信息
    SessionGuard,
    async ({ request, response, params }) => {
      const orderPatch: Order = await request.body().value
      response.body = await OrderModel.findByIdAndUpdate(params.rid, orderPatch)
    }
  )
  .get(
    "/:rid", //按订单id获取
    async ({ response, params }) => {
      response.body = await OrderModel.findById(params.rid)
    }
  )
  .get(
    "/", //读取所有订单
    async (ctx) => {
      ctx.response.body = await OrderModel.find().exec()
    }
  )
  .get(
    "/star/:rid", //收藏
    SessionGuard,
    async ({ state, params, response }) => {
      const user = await UserModel.findById(state.userId)
      if (!user) return
      user.stars?.addToSet(params.rid)
      await user.save()
      response.body = await OrderModel.findById(params.rid)
    }
  )
  .get(
    "/cancel-star/:rid", //取消收藏
    SessionGuard,
    async ({ state, params, response }) => {
      const user = (await UserModel.findById(state.userId))!
      user.stars?.remove(params.rid)
      await user.save()
      response.body = await OrderModel.findById(params.rid)
    }
  )