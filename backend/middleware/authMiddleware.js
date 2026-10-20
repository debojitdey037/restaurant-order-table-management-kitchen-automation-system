const jwt = require("jsonwebtoken");
const User = require("../models/User")

const protect = async(req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({message : `No token, please login`})
    }

    try{
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if(!user){
           return res.status(401).json({message: `User not found`})
        }
        res.user = user;
        next();

    }catch(error){
        console.log(error.mesaage);
        res.status(401).json({message: `Token not found`});
    }
}

const adminOnly = (req,res,next)=>{
        if(req.user.role === 'admin'){
            next();
        }
        else{
            res.status(403).json({message : `You are not admin`});
        }
}

module.exports = {protect,adminOnly};
