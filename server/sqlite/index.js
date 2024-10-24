import SQLite3 from 'sqlite3'
const sqlite3 = SQLite3.verbose();

class SQLiteDB {
  constructor(databaseName) {
    this.db = new sqlite3.Database(databaseName);
  }

  /**
   * 创建表
   * @param {String} tableName 表名
   * @param {Array} columns 表字段
   */
  createTable(tableName, columns) {
    return new Promise(resolve=>{
      const columnDefinitions = columns.map(column => `${column.name} ${column.type} ${column.default ? 'DEFAULT '+column.default : ''}`).join(', ');
      const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions})`;
      this.db.run(query, function(err){
        if (err) {
          resolve([err, null])
        } else {
          resolve([null, this])
        }
      });
    })
  }

  /**
   * 插入数据
   * @param {String} tableName 表名
   * @param {Object} data 插入数据
   */
  insertData(tableName, data) {
    return new Promise(resolve=>{
      const columns = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map(() => '?').join(', ');
      const values = Object.values(data);
      const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
      this.db.run(query, values, function(err){
        if (err) {
          resolve([err, null])
        } else {
          resolve([null, this])
        }
      });
    })
  }

  /**
   * 更新数据
   * @param {String} tableName 表名
   * @param {Object} data 更新数据
   * @param {Object} condition 更新条件
   */
  updateData(tableName, data, condition) {
    return new Promise(resolve=>{
      const setClause = Object.keys(data).map(column => `${column} = ?`).join(', ');
      const values = Object.values(data);
      const query = `UPDATE ${tableName} SET ${setClause} WHERE ${condition}`;
      this.db.run(query, values, function(err){
        if (err) {
          resolve([err, null])
        } else {
          resolve([null, this])
        }
      });
    })
  }

  /**
   * 删除数据
   * @param {String} tableName 表名
   * @param {Object} condition 条件
   */
  deleteData(tableName, condition) {
    return new Promise(resolve=>{
      const query1 = `SELECT * FROM ${tableName} WHERE ${condition}`;
      const query2 = `DELETE FROM ${tableName} WHERE ${condition}`;
      this.db.get(query1, (err1, res1) => {
        // console.log(err1, res1)
        // sql 报错
        if (err1) {
          return resolve([err1, res1])
        }
        // 通过条件没查询到数据
        if (!err1 && !res1) {
          return resolve(
            [
              {errno: 1, code: "NOT_FOUND", msg: '不存在'},
              res1
            ]
          )
        }
        // 正常删除
        if (!err1 && res1) {
          this.db.run(query2, (err2, res2) => {
            // console.log(err2, res2)
            return resolve([err2, res2])
          })
        }
        return resolve([null, null])
      });
    })
  }

  /**
   * 获取数据
   * @param {String} tableName 表名
   * @param {Object} condition 条件
   */
  getData(tableName, condition) {
    return new Promise(resolve=>{
      const query = `SELECT * FROM ${tableName} WHERE ${condition}`;
      this.db.all(query, (err, res) => {
        resolve([err, res])
      });
    })
  }

  /**
   * 获取分页数据
   * @param tableName
   * @param page
   * @param pageSize
   * @param condition // const condition = "column_name = 'value'";
   * @returns {Promise<unknown>}
   */
  getPagedData(tableName, page, pageSize, condition) {
    const offset = (page - 1) * pageSize;
    const countQuery = condition ? `SELECT COUNT(*) as total FROM ${tableName} WHERE ${condition}` : `SELECT COUNT(*) as total FROM ${tableName}`;
    const dataQuery = condition ? `SELECT * FROM ${tableName} WHERE ${condition} LIMIT ? OFFSET ?` : `SELECT * FROM ${tableName} LIMIT ? OFFSET ?`;

    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.get(countQuery, (err, row) => {
          if (err) {
            resolve([err, null]);
          } else {
            const total = row.total;

            this.db.all(dataQuery, [pageSize, offset], (err, rows) => {
              if (err) {
                resolve([err, null]);
              } else {
                const totalPages = Math.ceil(total / pageSize);
                resolve([null, { data: rows, total, totalPages }]);
              }
            });
          }
        });
      });
    });
  }

  /**
   * 执行自定义sql
   * @param {String} query
   * @param {String} params
   * @param {String} callback
   */
  executeQuery(query, params, callback) {
    this.db.all(query, params, (err, rows) => {
      if (err) {
        console.error(err);
      } else {
        callback(rows);
      }
    });
  }

  /**
   * 关闭数据库连接
   */
  closeConnection() {
    this.db.close();
  }
}

//================= 使用案例 ==================================
// const SQLiteDB = require('./SQLiteDB');

// 创建数据库连接
// const db = new SQLiteDB('D:\\WuWorkSpace\\code\\a-wu-project\\爬虫和逆向\\crawler-wusp\\AoMenMa\\2023\\aomen2023.db');
//
// // 执行自定义SQL查询
// const query = 'SELECT * FROM users WHERE age > ?';
// const params = [30];
// db.executeQuery(query, params, rows => {
//   console.log(rows);
// });
//
// // 创建表
// const columns = [
//   { name: 'id', type: 'INTEGER PRIMARY KEY AUTOINCREMENT' },
//   { name: 'name', type: 'TEXT' },
//   { name: 'age', type: 'INTEGER' }
// ];
// db.createTable('users', columns);
//
// // 插入数据
// const data = { name: 'John Doe', age: 25 };
// db.insertData('users', data);
//
// // 更新数据
// const newData = { age: 30 };
// const condition = 'name = "John Doe"';
// db.updateData('users', newData, condition);
//
// // 删除数据
// const deleteCondition = 'age > 30';
// db.deleteData('users', deleteCondition);
//
// // 关闭数据库连接
// db.closeConnection();

//===================== 分页案例 ===============================
// const page = 1;
// const pageSize = 10;
// const condition = "column_name = 'value'";
// db.getPagedData("user", page, pageSize,condition)
// .then(({ data, total, totalPages }) => {
//   console.log(data); // 处理分页查询结果
//   console.log(total); // 总数
//   console.log(totalPages); // 总页数
// })
// .catch(err => {
//   console.error(err); // 处理错误
// })
// .finally(() => {
//   db.closeConnection(); // 关闭数据库连接
// });

export default SQLiteDB;


