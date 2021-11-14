const User = require("../models/user");
const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

//signup controller
exports.signup=(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.status(422).json({
        error:errors.array()[0].msg
      })
    }
    const user = new User(req.body);
    user.save((err,user)=>{
     if(err){
        return res.status(400).json({
            err:"Not able to save user in DB"
        })
     }
     res.json(user);
    })
  }

//login controller
exports.login=(req,res)=>{
  const { email,password }=req.body;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    res.status(422).json({
      error:errors.array()[0].msg
    })
  }
  User.findOne({email},(err,user)=>{
    if(err || !user){
     return res.status(400).json({
        error:"User email does not exists"
      })
    }
    if(!user.authenticate(password)){
      return res.status(401).json({
        error:"Email and password do not match"
      })
    }
    //create token
   const token =jwt.sign({_id:user._id},process.env.SECRET)
   //put token in cookie(never expire for testing purpose)
   res.cookie("token",token,{expire: new Date()+9999});
   //send response to front end
   const {_id, name, email, role} = user;
   return res.json({token, user:{_id,name,email,role}})
  })
}

//logout controller
exports.logout=(req,res)=>{
  res.clearCookie("token");
  res.json({
      message:"User logout successfully"
  })
}

//protected routes
exports.isLoggedIn = expressJwt({
  secret: process.env.SECRET,
  algorithms: ['sha1', 'RS256', 'HS256'],
  userProperty: "auth"
})

//users controller
exports.users=(req,res)=>{
  User.find({},(err,users)=>{
    if(err || !users){
     return res.status(400).json({
        error:"No users found"
      })
    }
   return res.json({
       Users:users
      })
  })}