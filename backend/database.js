const { Pool } = require("pg");
require("dotenv").config();


const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: "localhost",
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT, // Default PostgreSQL port
});

pool.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err) => console.error("Connection error", err));

module.exports = pool;
