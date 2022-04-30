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
    public static async updateUser(user: any,callback: (Error:any,Result:any) => void){
        try {
            const toupdateuserid = user.userid;
            delete user.userid;
            const queryString = `update ${tablename} set ? where userid=?`;
            DB.getConnection((getconnectionerr:any, connection:any)=>{
                if(getconnectionerr){
                    callback(getconnectionerr,null);
                }else{
                    const i = connection.query(
                    queryString,
                    [user,toupdateuserid],
                    (queryerr:any, result:any) => {
                        if (queryerr) {
                            callback(queryerr,null)
                        }else{
                            callback(null, result as OkPacket);
                        }
                    });console.log(i.sql);
                    connection.release();
                }
            });

        } catch (error) {
            console.error(error);
             callback(error,null)
        }
    }
    
    public static async selectuser(userid:number,callback: (Error:any,MResult:any) => void){
        try{
            const queryString = "SELECT * FROM ${tablename}  where userid =?;";
            DB.getConnection((getconnectionerr:any, connection:any)=>{
                if(getconnectionerr){
                    callback(getconnectionerr,null);
                }else{
                    const i = connection.query(
                    queryString,[userid],
                    (queryerr:any, result:any) => {
                        if (queryerr) {
                            callback(queryerr,null)
                        }else{
                            callback(null, result[0]);
                        }
                    });// console.log(i.sql);
                    connection.release();
                }
            });

        }catch (error){
             callback(error,null)
        }
    }
  }