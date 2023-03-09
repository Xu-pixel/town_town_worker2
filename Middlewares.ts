import { Middleware, Status } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { UserModel } from "./models/User.ts";
import { sessions } from "./Sessions.ts";
import { TownTownState } from "./State.ts";

export const SessionGuard: Middleware<TownTownState> = async (ctx, next) => {
  const token = ctx.request.headers.get("token");
  if (token) {
    if (!sessions.has(token)) {
      const user = await UserModel.findOne({ token });
      if (user) sessions.set(token, user.id);
      else ctx.throw(Status.Forbidden);
    }
    ctx.state.userId = sessions.get(token)!;
  } else {
    ctx.throw(Status.Forbidden);
  }
  console.log(sessions);
  await next();
};

export const ErrorHandler: Middleware = async ({ response }, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
    response.body = { message: e.message };
    response.status = e.status || Status.BadRequest;
  }
};

export const Logger: Middleware = async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
};

// Timing
export const Timer: Middleware = async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
};
