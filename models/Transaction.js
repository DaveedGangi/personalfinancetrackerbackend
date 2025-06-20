const mongoose=require("mongoose");

const transactionSchema=new mongoose.Schema({
    userId:{type:String,required:true},
    amount:Number,
    category:String,
    description:String,
    date:{type:Date,default:Date.now},
    note:String
});

module.exports=mongoose.model("Transactions",transactionSchema);
