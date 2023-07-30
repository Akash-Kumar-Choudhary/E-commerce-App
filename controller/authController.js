import userModel from "../models/userModel.js";
import { comparePassword, HassPassword } from "../helper/authHelper.js";
import jwt from "jsonwebtoken";
import orderModel from "../models/orderModel.js";
export const registerController = async (req, res) => {
  try {
    const { name, password, email, phone, address, answer } = req.body;
    if (!name) {
      return res.send({ error: "name is required" });
    }
    if (!password) {
      return res.send({ error: "password is required" });
    }
    if (!email) {
      return res.send({ error: "email is required" });
    }
    if (!phone) {
      return res.send({ error: "phone is required" });
    }
    if (!address) {
      return res.send({ error: "address is required" });
    }
    if (!answer) {
      return res.send({ error: "answer is required" });
    }
    const existUser = await userModel.findOne({ email });
    if (existUser) {
      return res.send({
        success: true,
        message: "already register please login",
      });
    }
    const hassedPassword = await HassPassword(password);
    const users = await new userModel({
      name,
      password: hassedPassword,
      email,
      phone,
      answer,
      address,
    }).save();
    res.send({
      success: true,
      message: "User Register Successful",
      users,
    });
  } catch {
    res.status(500).send({
      success: false,
      message: "errror in register",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "invalid email or password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "error in login",
        error,
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "invalid password",
      });
    }
    const token = await jwt.sign({ id: user._id }, process.env.SCREAT_KEY, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      users: {
        name: user.name,
        password: user.password,
        email: user.email,
        phone: user.phone,
        answer: user.answer,
        address: user.address,
      },
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in login",
      error,
    });
  }
};

export const forgetPasswordController = async (req, res) => {
  try {
    const { email, newpassword, answer } = req.body;
    if (email === "" || answer === "" || newpassword === "") {
      return res.status(404).send({
        success: false,
        messgae: "required email , answer , newPassword ",
      });
    }
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "error in email and answer",
      });
    }
    const newhashed = await HassPassword(newpassword); 
    await userModel.findByIdAndUpdate(user._id , {password : newhashed} ,{'new':true,'runValidators':true})
    res.status(200).send({
      success: true,
      message: "upadate successfully",
      users: {
        name: user.name,
        password: user.password,
        email: user.email,
        phone: user.phone,
        answer: user.answer,
        address: user.address,
      },
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "something went wrong",
      error,
    });
  }
};

export const testController = (req, res) => {
  res.status(200)
};

export const updateProfileController = async(req , res) => {
  try{
    const {name , password , email , address , phone} = req.body
    console.log(req.body , req.user.id)
    const user = await userModel.findById(req.user.id)
    console.log(user)
    if(password && password?.length < 6){
      return res.json({error: 'password is required more than 6 character'})
    }
    const hasspassoword = password ? await HassPassword(password) : undefined
    const updatePassword = await userModel.findByIdAndUpdate(req.user.id , {
      name: name || user.name,
      password : hasspassoword || user.password,
      email:email || user.email,
      address : address || user.address,
      phone : phone || user.phone
    },{new : true})

    res.status(200).send({
      success:true,
      message:'upadate successfully',
      updatePassword
    })

  }catch(error){
    res.status(500).send({
      success: false,
      message:'Error while getting profile Update',
      error
    })
  }
}


export const orderContoller = async(req , res) => {
  try{
    const order = await orderModel.find({buyer : req.user.id}).populate('products' , '-photo').populate('buyer', 'name')
    res.json(order)
  }catch(error){
    console.log(error)
  }
}
export const allorderContoller = async(req , res) => {
  try{
    const order = await orderModel.find({}).populate('products' , '-photo').populate('buyer', 'name').sort({createdAt : '-1'})
    res.json(order)
  }catch(error){
    console.log(error)
  }
}

export const updateorderContoller = async(req ,res) => {
  try{
    const {orderId} = req.params
    const {status} = req.body
    const order = await orderModel.findByIdAndUpdate(orderId , {status} ,{new : true})
    res.json(order)
  }catch(error){
    res.status(500).send({
      success: false,
      message: 'Error while Updating Status'
    })
  }
}
