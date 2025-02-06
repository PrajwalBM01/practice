const { Router } = require('express');
const { user } = require('../models/dbModels');
const bcrypt = require('bcrypt')
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
    const { email,password } = req.body;
    const existing_user = await user.findOne({
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

   res.status(200).json({
    msg:"login succfull"
   })


})

router.get("/cources")
router.post("/courses/:courseId")
router.get("/purchasedCourses")

module.exports = router;