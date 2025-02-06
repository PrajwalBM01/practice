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

router.get("/courses",async(req,res)=>{
    const allCourse = await course.find()
    res.json({
        allCourse
    })
})
router.post("/courses/:courseId",userAuth,async(req,res)=>{
    const cid = req.params.courseId
    const token = req.headers.authorization
    const words = token.split(" ");
    const jwtToken = words[1];
    const verifed = jwt.verify(jwtToken,process.env.JWT_PASS);
    await user.updateOne({
        username:verifed.username
    },{
        "$push":{
            parchasedCourse: cid
        }
    });

    const courseDetial = await course.findOne({
        _id:cid
    })
    res.json({
        msg:"purchased the course",courseDetial
    })
});

router.get("/purchasedCourses",userAuth,async(req,res)=>{
    const token = req.headers.authorization
    const words = token.split(" ");
    const jwtToken = words[1];
    const verifed = jwt.verify(jwtToken,process.env.JWT_PASS);
    const reqUser = await user.findOne({
        username:verifed.username
    })
    const allCourse = []
    for(i=0;i<reqUser.parchasedCourse.length;i++){
        const cid = reqUser.parchasedCourse[i];
        const cname = await course.findOne({
            _id:cid
        })
        allCourse.push(cname.title)
    }
    res.json({
        courses:allCourse
    })
})

module.exports = router;