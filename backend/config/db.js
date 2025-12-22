require('dotenv').config()


const mysql = require('mysql2')

const pool  = createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    connectionLimit:4
})

pool.getConnection((err, connection) =>{
    if (err) {
        console.error(err)
    }else{
        console.log("Database connected successfully")
        connection.release()
    }
})

module.exports = pool