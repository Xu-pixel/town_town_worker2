import { Router, Status } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { SessionGuard } from "../Middlewares.ts";
import { OrderModel } from "../models/Order.ts";
import { UserModel } from "../models/User.ts";
import { sessions } from "../Sessions.ts";

const router = new Router();
export default router;

router
  .post(
    "/login/:code", //用户登录
    async ({ params, throw: _throw, response }) => {
      const dataFromWx = await fetch(
        `https://api.weixin.qq.com/sns/jscode2session?appid=${
          Deno.env.get("APP_ID")
        }&secret=${
          Deno.env.get("APP_SECRET")
        }&js_code=${params.code}&grant_type=authorization_code`,
      ).then((res) => res.json());
      console.log(dataFromWx);
      if (dataFromWx.errcode) {
        _throw(Status.BadRequest);
      }
      let user = await UserModel.findOne({ wxOpenId: dataFromWx.openid });
      if (!user) { //第一次登录
        const token = crypto.randomUUID();
        user = await UserModel.create({
          wxOpenId: dataFromWx.openid,
          name: "微信用户" + crypto.randomUUID(),
          token,
        });
      }
      sessions.set(user.token, user.id); //刷新会话
      response.body = {
        token: user.token,
      };
    },
  )
  .get(
    "/", //获取所有用户信息
    SessionGuard,
    async ({ state, response }) => {
      const user = await UserModel.findById(state.userId);
      response.body = user;
    },
  )
  .get(
    "/stars", //获取用户收藏的订单
    SessionGuard,
    async ({ response, state }) => {
      const user = (await UserModel.findById(state.userId))!;
      response.body = await OrderModel.find({ _id: { $in: user.stars } });
    },
  )
  .put(
    "/", //用户提交信息
    SessionGuard,
    async ({ request, state, response, throw: _throw }) => {
      const user = (await UserModel.findById(state.userId))!;
      if (user.status) _throw(Status.BadRequest, "您已经认证");
      const userPatch = (await request.body().value)!;
      userPatch.status = true;
      response.body = await user.update(userPatch);
    },
  );
