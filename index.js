const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connection = require("./config/db");
const adminRouter = require("./routes/adminRoute");
const userRouter = require("./routes/userRoute");
dotenv.config();
const PORT = process.env.PORT || 3000

connection();
app.use(express.json())

app.use("/user",userRouter)
app.use("/admin",adminRouter)


app.listen(PORT,()=>{
    console.log(`Listening on server ${PORT}`);
});