import { Router, Status } from "https://deno.land/x/oak@v11.1.0/mod.ts";
// import { SessionGuard } from "../Middlewares.ts";

const router = new Router();
export default router;

router
  .post(
    "/", //文件上传
    async (ctx) => {
      const { files } = await ctx.request.body({ type: "form-data" }).value
        .read();
      if (!files) ctx.throw(Status.BadRequest);
      const filenames = [];
      for (const file of files!) {
        const freshedFilename = crypto.randomUUID() + file.originalName; //给文件名拼接上uuid保证不会重名
        filenames.push(freshedFilename);
        Deno.copyFileSync(
          file.filename!,
          Deno.cwd() + "/images/" + freshedFilename,
        );
      }

      ctx.response.body = filenames; //返回所有图片的文件名
    },
  )
  .get(
    "/:freshedFilename",
    async (ctx) => {
      await ctx.send({
        root: `${Deno.cwd()}/images/`,
        path: `${ctx.params.freshedFilename}`,
      });
    },
  );
