import mongoose from "mongoose";

const bookSchema=new mongoose.Schema({
    bookname:{
        type:"String",
        required:true,
        unique:true
    },
    image:{
        type:"String",
        required:true,
        unique:true
    },
    description:{
        type:"String",
        required:true,
        unique:true
    },
    price:{
        type: Number,
        required: true,
    },
    genre:{
        type:String,
        enum:['nonfiction','drama','fiction','comics'],
        required:true

    },
    fileId:{
        type:String,
        required:false
    }
    
})

export default mongoose.model("Books",bookSchema)