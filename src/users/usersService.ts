// src/users/usersService.ts
const DB = require('../config/database');
import { OkPacket,RowDataPacket } from "mysql2";
import { User } from "./user";
const tablename = "users"

// A post request should not contain an id.
export type UserCreationParams = Pick<User, "email" | "name" | "phoneNumbers">;

export class UsersService {
      public static async getallusers(callback: (Error:any,Result:any) => void){
          try {
              const queryString = `select * from ${tablename};`;
              DB.getConnection((getconnectionerr:any, connection:any)=>{
                  if(getconnectionerr){
                      callback(getconnectionerr,null);
                  }else{
                      const i = connection.query(
                      queryString,
                      (qerr:any, result:any) => {
                          if (qerr) {
                              callback(qerr,null)
                          }else{
                              callback(null, result as OkPacket);
                          }
                      });// console.log(i.sql);
                      connection.release();
                  }
              });
  
          } catch (error:any) {
              console.error(error);
              throw new Error(error);
          }
      }
      public static async createuser(data:UserCreationParams,callback: (Error:any,Result:any) => void){
        try {
            const queryString = `insert into ${tablename} ?;`;
            DB.getConnection((getconnectionerr:any, connection:any)=>{
                if(getconnectionerr){
                    callback(getconnectionerr,null);
                }else{
                    const i = connection.query(
                    queryString,data,
                    (qerr:any, result:any) => {
                        if (qerr) {
                            callback(qerr,null)
                        }else{
                            callback(null, result as OkPacket);
                        }
                    });// console.log(i.sql);
                    connection.release();
                }
            });

        } catch (error:any) {
            console.error(error);
            throw new Error(error);
        }
    }
  }