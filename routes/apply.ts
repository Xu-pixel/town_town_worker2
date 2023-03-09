import { Router, Status } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { SessionGuard } from "../Middlewares.ts";
import { ApplyModel } from "../models/Apply.ts";
import { OrderModel } from "../models/Order.ts";
import {
  isDocument
} from "npm:@typegoose/typegoose@9.13.x";
// @deno-types="npm:@types/lodash@^4.14.191"
import { sumBy } from "https://deno.land/x/lodash@4.17.15-es/lodash.js";

const router = new Router();
export default router;

router
  .post(
    "/:rid", //报名rid为订单id,
    SessionGuard,
    async (ctx) => {
      const applies = await ApplyModel.find({ order: ctx.params.rid }).exec();
      const order = (await OrderModel.findById(ctx.params.rid).exec())!;
      if (order.status != "待确认") {
        ctx.throw(Status.BadRequest, "不能再申请了");
      }
      if (applies.length >= order.headCount * 3) {
        ctx.throw(Status.BadRequest, "申请人数过多");
      }
      if (applies.find((a) => a.worker?.toString() === ctx.state.userId)) {
        ctx.throw(Status.BadRequest, "您已经申请过了");
      }
      if (applies.length === order.headCount - 1) {
        order.status = "待确认";
        await order.save()
      }
      ctx.response.body = await ApplyModel.create({
        worker: ctx.state.userId,
        order: ctx.params.rid,
      });
    },
  )
  .get(
    "/order/:rid/worker/:uid", //根据工人和订单查申请
    async (ctx) => {
      ctx.response.body = await ApplyModel.findOne({
        order: ctx.params.rid,
        worker: ctx.params.uid
      })
    }
  )
  .get(
    "/order/:rid", //根据订单查申请人
    async (ctx) => {
      const applies = await ApplyModel.getAppliesByOrder(ctx.params.rid);
      const workers = []
      for (const apply of applies) {
        workers.push(apply.worker)
      }
      ctx.response.body = workers
    },
  )
  .get(
    "/worker/:uid", //根据申请人查订单
    async (ctx) => {
      const orders = []
      const applies = await ApplyModel.getAppliesByUser(ctx.params.uid);
      for (const apply of applies) {
        orders.push(apply.order)
      }
      ctx.response.body = orders
    },
  )
  .get(
    "/:rid", //获取与订单相关的申请
    SessionGuard,
    async (ctx) => {
      ctx.response.body = await ApplyModel.getAppliesByOrder(ctx.params.rid);
    }
  )
  .post(
    "/finish/:rid", //工人点击完成订单
    SessionGuard,
    async (ctx) => {
      const order = (await OrderModel.findById(ctx.params.rid))!;
      if (order.status != "进行中") {
        ctx.throw(Status.BadRequest, "还没开工呢");
      }
      const apply = (await ApplyModel.findOne({
        worker: ctx.state.userId,
        order: ctx.params.rid,
      }).exec())!;
      if (apply.status != "已通过") {
        ctx.throw(Status.BadRequest, "您未通过雇主的确认");
      }
      apply.finished = true;
      await apply.save()
      const applies = await ApplyModel.find({
        order: ctx.params.rid,
        status: "已通过",
      });
      if (sumBy(applies, (a) => a.finished ? 1 : 0) === order.headCount) {
        order.status = "已完成";
        await order.save()
      }
      ctx.response.body = {
        message: "已完成工作 " + apply.order,
      };
    },
  )
  .delete(
    "/:rid", //取消接单
    SessionGuard,
    async (ctx) => {
      const apply = (await ApplyModel.findOne({
        worker: ctx.state.userId,
        order: ctx.params.rid,
      }).exec())!;
      if (apply.status === "已通过" || apply.status === "已拒绝") {
        ctx.throw(Status.BadRequest, '已通过和已拒绝不能取消接单')
      }
      ctx.response.body = await apply.deleteOne()
    },
  )
  .post(
    "/check/:aid", //雇主审核
    async (ctx) => {
      const { status } = await ctx.request.body().value
      const apply = (await ApplyModel.findById(ctx.params.aid).populate('order', 'headCount').exec())!
      apply.status = status
      await apply.save()
      const applies = await ApplyModel.find({
        order: apply.order
      }).exec()
      if (!isDocument(apply.order)) return
      if (sumBy(applies, (a) => a.status === '已通过' ? 1 : 0) === apply.order.headCount) {
        apply.order.status = '进行中'
        await apply.order.save()
      }
      ctx.response.body = {
        message: status + apply.worker?.toString() + '的审核'
      }
    }
  )
