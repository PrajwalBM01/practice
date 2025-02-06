const { Router } = require('express');
const { admin } = require('../models/dbModels');
const bcrypt = require('bcrypt')
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
    const { email,password } = req.body;

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

    res.status(200).json({
        msg:"Login successful"
    })
})

router.get("/cources")
router.post("/courses")


module.exports = router;