require("dotenv").config();
const express = require("express");
require("express-async-errors");
const app1 = express();

//extra security package
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

//connectDB

const connectDB = require("./job-api/db/connect");
const authenticateUser = require("./job-api/middleware/authentication");
//routes

const authRouter = require("./job-api/routes/auth");
const jobsRouter = require("./job-api/routes/jobs");

//error handler
const notFoundMiddleware = require("./job-api/middleware/nout-found");
const errorHandlerMiddleware = require("./job-api/middleware/error-handler");
app1.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);
app1.set("trust proxy", 1);
app1.use(express.json());
app1.use(helmet());
app1.use(cors());
app1.use(xss());

//Swagger
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

app1.get("/", (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});
app1.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app1.use("/api/v1/auth", authRouter);
app1.use("/api/v1/jobs", authenticateUser, jobsRouter);

app1.use(notFoundMiddleware);
app1.use(errorHandlerMiddleware);
const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app1.listen(port, console.log(`Server  is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};
start();
