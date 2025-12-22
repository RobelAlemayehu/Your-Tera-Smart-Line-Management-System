const { createPool } = require('mysql')

const pool  = createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"Your_tera",
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