import mongoose from "mongoose";

const productModel= new mongoose.Schema({
    bookname:{
        type:"String",
        required:false,
    },
    orderId:{
        type:"String",

    },
    image:{
        type:"String",
        required:false, 
    },
    price:{
        type: Number,
        required: true,
    },
    quantity:{
        type:Number,
        required:false
    }
},{timestamps:true})

const orderModel= new mongoose.Schema({
    orderId:{
        type:String
    },
    status:{
        type:String
    },
    products:{
        type: [productModel]
    }
})


const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        unique:true,
        required:true
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
      },
    myOrders:{
        type:[orderModel],
        required:false
    }
})

export default mongoose.model("User",userSchema);