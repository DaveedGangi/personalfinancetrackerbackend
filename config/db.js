const express=require("express");
const { default: mongoose, model } = require("mongoose");

const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDb connected successfully");
    }
    catch(error){
        console.error(error);
        process.exit(1);
    }
}

module.exports=connectDb;