const { timeStamp } = require('console');
const mongoose=require('mongoose');
const { type } = require('os');

const tradeSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
        unique:true
    },
    UTC_time:{
        type:Date,
        required:true
    },
    operation:{
        type:String,
        required:true,
        enum:['Buy','Sell']
    },
    market:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    price:Number
},
{
    timestamps:true
})

const trade=mongoose.model('Trade',tradeSchema)

module.exports=trade;