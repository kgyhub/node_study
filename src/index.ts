import 'reflect-metadata'; // Decorator 를 사용하는 라이브러리에서 필요할 경우
import process from 'node:process';
import Koa from 'koa';
import Router from 'koa-router';
import koaBody from 'koa-bodyparser';
import * as sqlite from 'sqlite3';

const router = new Router();
const app = new Koa();
app.use(
  koaBody({
    extendTypes: {
      json: ['application/x-javascript'],
    },
  })
);

const sqlite3 = sqlite.verbose();
const db: sqlite.Database = new sqlite.Database(
  './sqliteDB.db',
  sqlite3.OPEN_READWRITE,
  (_error) => {
    if (_error) {
      console.error(_error.message);
      return false;
    }

    console.log('connection success!!');
  }
);

// Interface TodoItem {
//   id: string; // 유니크 아이디
//   title: string; // 제목
//   completed: boolean; // 완료 여부
//   createdAt: number; // 생성 시각(밀리세컨드)
// }

router.get('/', (ctx) => {
  ctx.body = '홈';
});

// GET 1
router.get('/api/todos', (_ctx) => {
  const sql = 'SELECT * FROM todo_item';
  db.all(sql, [], (error, rows) => {
    if (error) {
      throw error;
    }

    for (const row of rows) {
      console.log(row);
    }
  });
});

//  GET 2
router.get('/api/todo/:id', (ctx) => {
  const uid = ctx.params;
  console.log(uid.id);

  const sql = 'SELECT * FROM todo_item where id =?';
  db.get(sql, uid.id, (error, row: any) => {
    if (error) {
      throw error;
    }

    console.log(row);
  });
  ctx.body = uid;
});

// PUT
router.put('/api/todos/:id', (ctx) => {
  ctx.body = '';
});

router.post('/api/todo', (ctx) => {
  const uid = Math.random().toString(32).slice(2);
  const posttitle = JSON.stringify(ctx.request.body.title);

  db.run(
    `INSERT INTO todo_item(id,title,completed,createdAt) VALUES('${uid}','${posttitle}', 1, CURRENT_TIMESTAMP)`,
    function (error) {
      if (error) {
        console.log(error.message);
        return false;
      }

      console.log(`A row has been inserted with rowid ${uid}`);
    }
  );
  ctx.body = { uid, posttitle };
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = process.env.PORT ?? 8080;

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
