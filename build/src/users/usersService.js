"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
// src/users/usersService.ts
const DB = require('../config/database');
const tablename = "users";
class UsersService {
    static getallusers(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryString = `select * from ${tablename};`;
                DB.getConnection((getconnectionerr, connection) => {
                    if (getconnectionerr) {
                        callback(getconnectionerr, null);
                    }
                    else {
                        const i = connection.query(queryString, (qerr, result) => {
                            if (qerr) {
                                callback(qerr, null);
                            }
                            else {
                                callback(null, result);
                            }
                        }); // console.log(i.sql);
                        connection.release();
                    }
                });
            }
            catch (error) {
                console.error(error);
                throw new Error(error);
            }
        });
    }
    static createuser(data, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryString = `insert into ${tablename} ?;`;
                DB.getConnection((getconnectionerr, connection) => {
                    if (getconnectionerr) {
                        callback(getconnectionerr, null);
                    }
                    else {
                        const i = connection.query(queryString, data, (qerr, result) => {
                            if (qerr) {
                                callback(qerr, null);
                            }
                            else {
                                callback(null, result);
                            }
                        }); // console.log(i.sql);
                        connection.release();
                    }
                });
            }
            catch (error) {
                console.error(error);
                throw new Error(error);
            }
        });
    }
}
exports.UsersService = UsersService;
//# sourceMappingURL=usersService.js.map