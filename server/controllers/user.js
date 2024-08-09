import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
export const signup = async (req, res) => {
  try {
    const { username, email, password ,role} = req.body;
    const newUser = await User.create({ username, email, password,role });
    console.log(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
  }
};

export const signin=async(req,res)=>{
try {
    const {email,password}=req.body;
    const loggedUser=await User.findOne({email});
    console.log(loggedUser);
    
    if(!loggedUser){
        return res.json({message:'invalid email or password'})
    }
    //check if password matches
    const matchPassword=await bcrypt.compare(password,loggedUser.password)
    //create a jwt token
    
    const token=jwt.sign({userid:loggedUser._id,email:loggedUser.email},process.env.JWT_SECRET);
    console.log(process.env.JWT_SECRET);
    
    res.json({token})
   
    
    
} catch (error) {
    console.log(error);
    
}
}
