"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const sls = require('serverless-http');
/* const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
 */
module.exports.handler = sls(app_1.app);
//# sourceMappingURL=server.js.map