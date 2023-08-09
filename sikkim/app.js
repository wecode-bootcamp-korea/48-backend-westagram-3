require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { DataSource } = require("typeorm");

const app = express();

// const { DataSource } = require("typeorm"); --> 중복된듯?

const appDataSource = new DataSource({
  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

//아래의 부분은 중복된 코드? from 경래멘토님

//appDataSource.initialize().then(() => {
//  console.log("Data Source has been initialized!");
//});

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.listen(3000, async () => {
  await appDataSource
    .initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((error) => {
      console.error("Error during Data Source initialization", error);
    });

  console.log(`Listening to request on port: 3000`);
});

/*
//아래는 express

const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!! This is test for nodemon~!");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
// 아래는 DATABASE , TYPEORM 연동?
const dotenv = require("dotenv");

dotenv.config();

const { DataSource } = require("typeorm");

const myDataSource = new DataSource({
  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

appDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");
});

// 아래는 cors // 모든 request에 대해 CORS 요청을 설정하는 방법

const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/ping", function (req, res, next) {
  res.json({ message: "pong" });
});

app.listen(3000, function () {
  console.log("server listening on port 3000");
});
*/
//위 넓은 주석은 혼자 연습해본 코드란
