import Koa from 'koa';
import Router from 'koa-router';

const app = new Koa();
const router = new Router();

router.get('http://localhost:8080/api/todos', async (ctx, next) => {
  ctx.body = { msg: 'hello api todos' };

  await next();
});

app.use(router.routes()).use(router.allowedMethods());
