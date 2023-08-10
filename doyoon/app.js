const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const dotenv = require("dotenv")
const bcrypt = require("bcrypt")

dotenv.config();

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

app.post('/users', async (req, res) => {
	const { name, email, password} = req.body;
  const hash = bcrypt.hashSync(password, 12);

    
	await appDataSource.query(
		`INSERT INTO users(
			name,
			email,
			password
		) VALUES (?, ?, ?);
		`,
		[name, email, hash]
	); 
     res.status(201).json({ message : "successfully created" });
	})

  

app.listen(3000, function() {
	"listening on port 3000";
});