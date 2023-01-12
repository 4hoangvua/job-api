var express = require("express");
var bodyParser = require("body-parser");
var accountRouter = require("./routers/account");
const app = express();
const port = 3000;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  next();
});
app.use("/api/account", accountRouter);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
