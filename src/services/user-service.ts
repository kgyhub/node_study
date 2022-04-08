import * as sqlite from 'sqlite3';

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

export class UserService {
  private readonly token: string;

  constructor(token: string) {
    if (!token) {
      throw new Error('Invalid Token');
    }

    this.token = token;
  }

  async getAllItems() {
    console.log('Using token: getAllItems', this.token);
    const sql = 'SELECT * FROM todo_item';
    db.all(sql, [], (error, rows) => {
      if (error) {
        throw error;
      }

      for (const row of rows) {
        console.log(row);
      }
    });
  }

  async getOneItem() {
    const sql = 'SELECT * FROM todo_item where id =?';
    const uid = this.token;
    db.get(sql, uid, (error, row: any) => {
      if (error) {
        throw error;
      }

      console.log(row);
    });
  }

  async updateItem(uid: string, title: string, completed: string) {
    console.log(title);
    db.run(
      `UPDATE todo_item SET title='${title}' AND completed=${completed} WHERE id='${uid}'`,
      function (error) {
        if (error) {
          console.log(error.message);
          return false;
        }

        console.log(`A row has been updated with rowid ${uid}`);
      }
    );
  }

  async insertOneItem(uid: string, title: string) {
    db.run(
      `INSERT INTO todo_item(id,title,completed,createdAt) VALUES('${uid}','${title}', 1, CURRENT_TIMESTAMP)`,
      function (error) {
        if (error) {
          console.log(error.message);
          return false;
        }

        console.log(`A row has been inserted with rowid ${uid}`);
      }
    );
  }
}
