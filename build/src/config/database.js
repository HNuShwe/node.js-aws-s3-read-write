"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const pool = mysql2_1.default.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "test",
    multipleStatements: true,
    connectionLimit: 100,
});
exports.getConnection = (callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            callback(err, null);
        }
        else {
            callback(err, connection);
        }
    });
};
//# sourceMappingURL=database.js.map