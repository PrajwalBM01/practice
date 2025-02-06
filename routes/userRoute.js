const { Router } = require('express');
const { user, course } = require('../models/dbModels');
const bcrypt = require('bcrypt');
const userAuth = require('../middleware/userAuth');
const jwt = require("jsonwebtoken")
const router = Router();

router.post("/signin",async (req,res)=>{
    const {username,email,password} = req.body;
    const hash_pass = await bcrypt.hash(password,10)

    const existing = await user.findOne({
        email:email
    })

    if(existing){
        return res.json({
            msg:"user already exist please login."
        })
        
    }

    try{
        const new_user = await user.create({
            username:username,
            email:email,
            password:hash_pass
        })
        res.json({
            msg: 'user created succfully',new_user
        })
    }catch(err){
        res.json({
            msg:'some error occured',err
        })
    }

})

router.post("/login",async (req,res)=>{
    const { username,email,password } = req.body;
    const existing_user = await user.findOne({
        username:username,
        email:email
    })

    if(!existing_user){
        return res.status(400).json({
            msg:"user doesnot exist pleas signin"
        })
    }

    const isMatch = await bcrypt.compare(password,existing_user.password)
    if(!isMatch){
        return res.status(400).json({
            msg:"invalid credentials, check your email and password."
        })
    }

    const token = jwt.sign({username},process.env.JWT_PASS,{expiresIn:'1h'})
    console.log(token)
    res.send("login succefully and got token");

})

router.get("/courses",userAuth,async(req,res)=>{
    const allCourse = await course.find()
    res.json({
        allCourse
    })
})
router.post("/courses/:courseId",userAuth,(req,res)=>{
    const course = req.querry
})
router.get("/purchasedCourses",userAuth)

module.exports = router;