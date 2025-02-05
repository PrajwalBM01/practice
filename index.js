const express = require("express");
const app = express();
const dotenv = require("dotenv")
dotenv.config();
const PORT = process.env.PORT || 3000

app.get("/",(req,res)=>{
    res.json("app is running")
})




app.listen(PORT,()=>{
    console.log(`Listening on server ${PORT}`);
});