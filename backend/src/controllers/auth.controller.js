const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const emailService = require("../services/email.service")
const tokenBlackListModel = require("../models/blackList.model");
/**
* - user register controller
* - Post   /api/auth/register
*/
async function userRegisterController(req,res){
  const {email,password,name} = req.body;

  const isExist = await userModel.findOne({email:email})
  if(isExist){
    return res.status(422).json({meassage:"user already exist with email",status:"failed"})
  }
  const user = await userModel.create({
    email,password,name
  })

  const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"})

  res.cookie("token",token)
  res.status(201).json({ meassage:"register successfully",
    user:{
        _id:user._id,
        email:user.email,
        name:user.name
    },
    token
  })
  await emailService.sendRegistrationEmail(user.email,user.name)
}

/**
* - user register controller
* - Post   /api/auth/login
*/
async function userLoginController(req,res){
  const {email,password} = req.body;
  const user = await userModel.findOne({email}).select("+password")
  if(!user){
    return res.status(401).json({meassage:"user not found with email",status:"failed"})
  }
 const isValidPassword= await  user.comparePassword(password)
  if(!isValidPassword){ 
    return res.status(401).json({meassage:"invalid password",status:"failed"})
  }
  const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"})
    res.cookie("token",token)
  res.status(200).json({ meassage:"login successfully",
    user:{
        _id:user._id,
        email:user.email,
        name:user.name
    },
    token
  })
}

/**
 * - user logout controller
 * - Post   /api/auth/logout
 * - clear cookie from client side
 */
async function userLogoutController(req,res) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if(!token){
    return res.status(400).json({
        message:"user logged out successfully"
    })
  }

  await tokenBlackListModel.create({
    token: token
  })

  res.clearCookie("token")

  return res.status(200).json({
    message:"user logged out successfully"
  })
}

module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController
}