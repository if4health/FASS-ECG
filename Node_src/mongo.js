require('dotenv').config({path:__dirname+'/.env'})
const mongoose = require("mongoose")

const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env

let connString = process.env.DB_URI;

class dbConnect{
    
    constructor(){
        console.log(connString)
        mongoose.connect(connString, {dbName : DB_NAME, useNewUrlParser: true, useUnifiedTopology: true})
    

        this.mongodb = mongoose.connection;

    }
}

module.exports = new dbConnect()
