const express = require("express");
const app = express();
const initRoutes = require("./src/routes/web");
const cors = require('cors');
const serverConfig  = require('./src/config/server.config');
const bodyParser = require('body-parser');
const swaggerUIPath= require("swagger-ui-express");
const swaggerjsonFilePath = require("./docs/swagger.json");

global.__basedir = __dirname;
app.use(bodyParser.json());
app.use(cors());

app.use("/api-docs", swaggerUIPath.serve, swaggerUIPath.setup(swaggerjsonFilePath));

initRoutes(app);

let port = serverConfig.PORT_SERVER;

app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});