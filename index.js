import Koa from "koa";
import staticFiles from "koa-static";
import path from "path";
import Router from "koa-router";
import fetch from "node-fetch";

const CLIENT_ID =
  "4a4e4f0e467a6c14b848bf6f94475cf2e122e9579480ae4811f8bb27e62b51a1";
const CLIENT_SECRET =
  "7cd676d83a6a644756cbce8f056398c8be47d17a54786385a1ed61145ae6ca58";
const GITLAB_URL = "http://10.180.38.148/oauth/token";

const router = new Router();

router.get("/gitlab/oauth/token", async (ctx, next) => {
  const params = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: ctx.query.code,
    grant_type: ctx.query.grant_type,
    redirect_uri: ctx.query.redirect_uri,
  };
  const response = await fetch(GITLAB_URL, {
    method: "POST",
    body: JSON.stringify(params),
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  if (data.error) {
    ctx.body = { code: 500, data };
  } else {
    ctx.body = {
      code: 200,
      data: `${data.token_type} ${data.access_token}`,
    };
  }
});

const app = new Koa();

app.use(async (ctx, next) => {
  await next();
});
app.use(staticFiles(path.join("./html")));
app.use(router.routes()).use(router.allowedMethods());

app.listen(7878, () => {
  console.log("http://127.0.0.1:7878");
});
