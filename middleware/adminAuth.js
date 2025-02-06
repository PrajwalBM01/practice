const jwt = require('jsonwebtoken');

async function adminAuth(req,res,next){
    const token = req.headers.authorization
    const words = token.split(" ");
    const jwtToken = words[1];
    try{
        const decoded = jwt.verify(jwtToken,process.env.JWT_PASS);
        if(decoded.username)
        next();
    }catch(err){
        res.json({msg:"invalid credentials"})
        console.log(err)
    }
}

module.exports = adminAuth;