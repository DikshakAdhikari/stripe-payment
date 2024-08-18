import mongoose from "mongoose";

const productModel= new mongoose.Schema({
    bookname:{
        type:"String",
        required:false,
     
    },
    image:{
        type:"String",
        required:false,
    },
    description:{
        type:"String",
        required:false,
    },
    price:{
        type: Number,
        required: true,
    },
    genre:{
        type:String,
        required:false,
        enum:['nonfiction','drama','fiction','comics'],
    
    },
    fileId:{
        type:String,
        required:false
    },
    quantity:{
        type:Number,
        required:false
    }
},{timestamps:true})

const orderSchema= new mongoose.Schema({
    amount:{
        type:Number
    },
    currency:{
        type:String
    },
    status:{
        type:String
    },
    deliveryStatus:{
        type:String,
        default:"none"
    },
    createDate:{
        type:Date,
        default:Date.now()
    },
    paymentIntentId:{
        type:String,
       
    },
    products:{
        type: [productModel]
    },
    address: {
        type:String,
        required:false
    },
    userId: {
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})

export default mongoose.model("Order",orderSchema)