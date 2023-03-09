import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { Router, Status } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { SessionGuard } from "../Middlewares.ts";
import { MessageModel } from "../models/Message.ts";
import { UserModel } from "../models/User.ts";

const router = new Router();
export default router;

router
  .get(
    "/:uid", //返回用户的所有message
    SessionGuard,
    async ({ state, response }) => {
    }
  )
  .get(
    "/:mid",
    SessionGuard,
    async ({ response, params }) => {
      response.body = await MessageModel.findByIdAndUpdate(params.mid, { isView: true })
    }
  )