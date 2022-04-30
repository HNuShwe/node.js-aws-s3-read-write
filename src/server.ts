import { app } from "./app";
const sls = require('serverless-http');

/* const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
 */
module.exports.handler = sls(app);