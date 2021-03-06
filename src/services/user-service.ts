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
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE todo_item SET title='${title}' AND completed=${completed} WHERE id='${uid}'`,
        function (error) {
          if (error) {
            reject(error);
          }

          console.log(`A row has been updated with rowid ${uid}`);
          resolve({ uid, title, completed });
        }
      );
    });
  }

  async insertOneItem(uid: string, title: string) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO todo_item(id,title,completed,createdAt) VALUES('${uid}','${title}', 1, CURRENT_TIMESTAMP)`,
        function (error) {
          if (error) {
            // Console.log(error.message);
            // return false;
            reject(error);
          }

          console.log(`A row has been inserted with rowid ${uid}`);
          resolve({ uid });
        }
      );
    });
  }

  async deleteItem(): Promise<{ uid: string }> {
    const uid = this.token;
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM todo_item WHERE id = ?`, uid, (error) => {
        if (error) {
          // Console.log(error.message);
          reject(error);
        }

        console.log(`Deleted ${uid}`);
        resolve({ uid });
      });
    });
  }
}
