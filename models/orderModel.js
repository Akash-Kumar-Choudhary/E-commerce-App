import mongoose from 'mongoose'
const orderSchema = new mongoose.Schema({
    products :[{
        type : mongoose.ObjectId,
        ref : 'product'

    }],
    payment : {},
    buyer : {
        type : mongoose.ObjectId,
        ref : 'users'
    },
    status : {
        type : String,
        default : 'Not Process',
        enum : ['Not Process' , 'processing' , 'shipping' , 'delivered' , 'cancel']
    }
} , {timestamps : true})
export default mongoose.model('order' , orderSchema)