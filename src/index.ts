import 'reflect-metadata'; // Decorator 를 사용하는 라이브러리에서 필요할 경우
import process from 'node:process';
import Koa from 'koa';
import Router from 'koa-router';
import * as sqlite from 'sqlite3';

const router = new Router();
const app = new Koa();
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

router.get('/', (ctx) => {
  ctx.body = '홈2';
});

router.get('/api/todos', (ctx) => {
  const sql = 'SELECT * FROM todo_item';
  db.all(sql, [], (error, rows) => {
    if (error) {
      throw error;
    }

    for (const row of rows) {
      console.log(row);
    }

    ctx.body = rows;
  });
});

router.put('/api/todos/id', (ctx) => {
  ctx.body = '';
});

router.post('/api/todo', (ctx) => {
  ctx.body = '';
  const uid = Math.random().toString(32).slice(2);
  console.log(uid);
  db.run(
    `INSERT INTO todo_item(id,title,completed,createdAt) VALUES('${uid}','testtitle', 1, CURRENT_TIMESTAMP)`,
    function (error) {
      if (error) {
        console.log(error.message);
        return false;
      }

      console.log(`A row has been inserted with rowid ${uid}`);
    }
  );
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = process.env.PORT ?? 8080;

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
