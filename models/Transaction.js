const mongoose=require("mongoose");

const transactionSchema=new mongoose.Schema({
    userId:{type:String,required:true},
    amount:Number,
    type: {
    type: String,
    enum: ["income", "expense"],
    required: true,
    default: "expense",
  },
    category:String,
    description:String,
    date:{type:Date,default:Date.now},
    note:String
});




module.exports=mongoose.model("Transactions",transactionSchema);
