import mysql from "mysql2";

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "test",
  multipleStatements:true,
  connectionLimit : 100,
});

exports.getConnection = (callback: (arg0: NodeJS.ErrnoException, arg1: mysql.PoolConnection | null) => void)=> {
  pool.getConnection((err, connection)=> {
      if(err)
      {
          callback(err,null);
      }
      else
      {
          callback(err, connection);
      }

  });
};
