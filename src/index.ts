import 'reflect-metadata'; // Decorator 를 사용하는 라이브러리에서 필요할 경우
import process from 'node:process';
import Koa from 'koa';
import Router from 'koa-router';
import koaBody from 'koa-bodyparser';
import { UserService } from './services/user-service';

// Interface TodoItem {
//   id: string; // 유니크 아이디
//   title: string; // 제목
//   completed: boolean; // 완료 여부
//   createAt: number; // 생성 시각(밀리세컨드)
// }

const router = new Router();
const app = new Koa();
app.use(
  koaBody({
    extendTypes: {
      json: ['application/x-javascript'],
    },
  })
);

// GET 1
router.get('/api/todos', async (ctx) => {
  const userService = new UserService('11');
  await userService.getAllItems();
  ctx.body = 'get all';
});

//  GET 2
router.get('/api/todo/:id', async (ctx) => {
  const uid = ctx.params.id;
  console.log(uid);
  const userService = new UserService(uid);
  await userService.getOneItem();
  ctx.body = { uid };
});

// PUT
router.put('/api/todos/:id', async (ctx) => {
  const uid = ctx.params.id;
  const puttitle = JSON.stringify(ctx.request.body.title);
  const putcmpltd = JSON.stringify(ctx.request.body.completed);
  console.log(puttitle);
  const userService = new UserService(uid);
  try {
    const resultUpdate = await userService.updateItem(uid, puttitle, putcmpltd);
    ctx.body = resultUpdate;
  } catch (error: unknown) {
    ctx.body = error instanceof Error ? error.message : '예상치 못한 에러';
  }

  ctx.body = { uid, puttitle, putcmpltd };
});

router.post('/api/todo', async (ctx) => {
  const uid = Math.random().toString(32).slice(2);
  const posttitle = JSON.stringify(ctx.request.body.title);
  const userService = new UserService(uid);

  try {
    const result = await userService.insertOneItem(uid, posttitle);
    ctx.body = result;
  } catch (error: unknown) {
    ctx.body = error instanceof Error ? error.message : '예상치 못한 에러';
  }
});

router.delete('/api/todos/:id', async (ctx) => {
  const uid = ctx.params.id;
  const userService = new UserService(uid);

  try {
    const value = await userService.deleteItem();
    ctx.body = value;
  } catch (error: unknown) {
    ctx.body = error instanceof Error ? error.message : '예상치 못한 에러';
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = process.env.PORT ?? 8080;

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
