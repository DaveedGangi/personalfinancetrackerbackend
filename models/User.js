const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    clerkId:{type:String,required:true,unique:true},
    email:{type:String,required:true},
    frequency:{type:String,enum:["daily","monthly","none"],default:"none"}
});

module.exports=mongoose.model("User",userSchema);