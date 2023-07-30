import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";


export const requiresignIn = async (req, res, next) => {
  try {
    const decode = jwt.verify(req.headers.authorization, process.env.SCREAT_KEY);
    req.user=decode
    next();
  } catch (error) {
    console.log(error);
  }
};

export const Admin=async(req,res,next)=> {
    try{
        const user=await userModel.findById(req.user.id)
        if(!user){
            return res.status(201).send({
                message:'user not found',
                success:false
            })
        }
        else{
            res.status(200).send({
                success:true,
                data : {
                    _id : user._id,
                    password : user.password,
                    email : user.email,
                    name: user.name,
                    phone : user.phone,
                    address : user.address,
                    token : user.token,
                    role : user.role
                }
            })
            next()
    }
    }catch(error){
        res.status(500).send({
            success:false,
            message:'error in admin',
            error
        })
    }
}

export const isAdmin=async(req,res,next) => {
    try {
        const user = await userModel.findById(req.user.id)
        if(user.role !== 1){
            return res.status(401).send({
                success : false ,
                message : 'unorthorised Access'
            })
        }
        else {
            next()
        }

    } catch(error){
        res.status(500).send({
            success : false,
            message : "error in message",
            error
        })
    }
}