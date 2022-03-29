require('dotenv').config({path:__dirname+'/.env'})
const mongoose = require("mongoose")

const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env

// let connString = process.env.DB_URI;
let connString = 'mongodb+srv://tcc:tccSenha@cluster0.tx7an.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
class dbConnect{
    
    constructor(){
        console.log(connString)
        mongoose.connect(connString, {dbName : DB_NAME, useNewUrlParser: true, useUnifiedTopology: true})
    

        this.mongodb = mongoose.connection;

    }
}

module.exports = new dbConnect()