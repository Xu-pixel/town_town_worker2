import { Router, Status } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { SessionGuard } from "../Middlewares.ts";
import { Comment, CommentModel } from "../models/Comment.ts";
import { UserModel } from "../models/User.ts";


const router = new Router();
export default router;

router
  .get(
    "/:uid",
    async ({ params, response }) => {

    }
  )
  .post(
    "/:uid",
    SessionGuard,
    async ({ request, response, params, state }) => {

    }
  )