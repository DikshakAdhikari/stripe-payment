import mongoose from "mongoose";

const fileSchema=new mongoose.Schema({

    file:{
        type:String,
        required:true
    }
    
})

export default mongoose.model("file",fileSchema)