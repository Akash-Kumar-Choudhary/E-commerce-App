import mongoose from "mongoose";

const productCategory = new mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    slug :{
        type : String ,
        required : true
    },
    description:{
        type:String,
        required : true,
    },
    price :{
        type : Number,
        required :true
    },
    category :{
        type : mongoose.ObjectId,
        ref : 'category',
        required : true
    },
    quantity : {
        type : String ,
        required :true,
    },
    photo : {
        data : Buffer,
        contentType:String
    },
    shipping :{
        type : Boolean,
    }
},{timestamps : true})

export default mongoose.model('product' , productCategory)