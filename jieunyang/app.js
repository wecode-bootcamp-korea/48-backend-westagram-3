require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");

const { DataSource } = require('typeorm');

const appDataSource = new DataSource({
	    type: process.env.DB_CONNECTION,
	    host: process.env.DB_HOST,
	    port: process.env.DB_PORT,
	    username: process.env.DB_USERNAME,
	    password: process.env.DB_PASSWORD,
	    database: process.env.DB_DATABASE
});

appDataSource
  .initialize()
  .then(() => {
	      console.log("Data Source has been initialized!");
	    })
  .catch((error) => console.log(error));

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/ping", function (req, res, next) {
		res.json({ message: "pong"});
});

app.listen(3000, function() {
		"listening on port 3000";
});
