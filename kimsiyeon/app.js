require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcrypt");

const { DataSource } = require("typeorm");

const app = express();

const appDataSource = new DataSource({
  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.post("/user", async (req, res, next) => {
  const { name, email, password } = req.body;
  const hashpassword = bcrypt.hashSync(password, 12);
  await appDataSource.query(
    `INSERT INTO users
    (name,email,password)
    VALUES (? , ? , ?);`,
    [name, email, hashpassword]
  );
  res.status(201).json({ message: "userCreated" });
});

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
      console.error("Error during Data Source has been initialized", error);
    });
  console.log(`Listening to request on port: ${3000}`);
});
