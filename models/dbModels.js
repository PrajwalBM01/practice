const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: String,
    email : String,
    password : String,
    parchasedCourse:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'course'
    }]
})

const adminSchema = new mongoose.Schema({
    username: String,
    email : String,
    password : String
})


const courseSchema = new mongoose.Schema({
    title : String,
    discription : String,
    price : Number
})

const user= mongoose.model("User",userSchema)
const admin= mongoose.model("Admin",adminSchema)
const course= mongoose.model("Course",courseSchema)

module.exports = {
    user,
    admin,
    course
};