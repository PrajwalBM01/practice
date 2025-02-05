const mongoose = require('mongoose');

async function connection(){
    try{
        await mongoose.connect(process.env.CONNECTION_URL)
        console.log("Database connected")
    }catch(err){
        console.log("error occured while connecting to DB",err)
    }
}

module.exports = connection;