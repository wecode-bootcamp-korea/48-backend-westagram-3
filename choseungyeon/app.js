require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');


const app = express();

const { DataSource } = require('typeorm')

const appDataSource = new DataSource({
  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
})

appDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  });

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get("/ping", (req, res) => {
    res.json({ message : "pong"});
});

app.listen(3000, async () => {
  await appDataSource
    .initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((error) => {
      console.error('Error during Data Source initialization', error);
    });

  console.log(`Listening to request on port: 3000`);
});

app.post('/login', async (req, res) => {
	const { user_id, user_pw } = req.body //프론트에서 받아오는 변수 
    
	const myDB = await appDataSource.query(
		`INSERT INTO users(
			user_id,
			user_pw
		) VALUES (?, ?);
		`,
		[ user_id, user_pw ]
	); 
     res.status(201).json({ message : "successfully created", myDB });
	})