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

appDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");
});

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  const saltRounds = 12;

  const makeHash = bcrypt.hash(req.body.password, saltRounds);

  await appDataSource.query(
    `INSERT INTO users(
			name,
			email,
      password
		) VALUES (?, ?, ?);
		`,
    { name, email, makeHash }
  );
  res.status(201).json({ message: "successfully created" });
});

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.listen(3000, function () {
  "listening on port 3000";
});
