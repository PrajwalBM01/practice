const { Router } = require('express');
const { admin, course } = require('../models/dbModels');
const bcrypt = require('bcrypt');
const adminAuth = require('../middleware/adminAuth');
const jwt = require('jsonwebtoken')
const router = Router(); 

router.post("/signin",async(req,res)=>{
    const { username,email,password } = req.body;
    const hash_pass = await bcrypt.hash(password,10);

    const exisintg_admin = await admin.findOne({
        email:email
    })
    if(exisintg_admin){
        return res.json({
            msg:"admin allredy exist please login"
        })
    }

    try{
        const new_admin = await admin.create({
            username:username,
            email:email,
            password:hash_pass
        })
        res.status(200).json({
            msg:"admin created",new_admin
        })
    }catch(err){
        res.status(400).json({
            msg:"somthing went wrong ",err
        })
    }
})

router.post("/login",async(req,res)=>{
    const { username,email,password } = req.body;

    const exisintg_admin = await admin.findOne({
        email:email
    })

    if(!exisintg_admin){
        return res.status(400).json({
            msg:"admin does not exist pleas signin"
        })
    }

    const isMatch = await bcrypt.compare(password,exisintg_admin.password);
    if(!isMatch){
        return res.status(400).json({
            msg:"invalid creditnatals, chekc email and password"
        })    
    }

    const token = jwt.sign({username},process.env.JWT_PASS,{expiresIn:'1h'})
    console.log(token)
    res.send("login succefully and got token");
})

router.get("/courses",adminAuth,async(req,res)=>{
    const allCourse = await course.find();
    res.json(allCourse);
})

router.post("/courses",adminAuth,async(req,res)=>{
    const { title, discription,price } = req.body

    await course.create({
        title:title,
        discription:discription,
        price:price
    })

    res.json({
        msg:"course created"
    })
})


module.exports = router;