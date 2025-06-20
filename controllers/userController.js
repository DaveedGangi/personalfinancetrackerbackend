const express=require("express");

const router=express.Router();

const User=require("../models/User.js");


const init=async(req,res)=>{

    try{
        const{clerkId,email,frequency}=req.body;
        const existingUser=await User.findOne({clerkId});
        if(!existingUser){

            const user=new User({clerkId,email,frequency});
            await user.save();
           return res.status(201).json({message:"User created successfully"});

        }
      res.status(200).json({message:"User already exists"});


    }
    catch(err){
        console.error(err);
     res.status(500).json({error:err.message});
    }


};

const getFrequency=async(req,res)=>{
    const{clerkId}=req.query;
     try{
        const existingUser=await User.findOne({clerkId});

        if(!existingUser) return res.status(404).json({message:"User doesn't exist"});

        res.status(200).json({frequency:existingUser.frequency});
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:err.message});

    }
}

const updateFrequency= async(req,res)=>{
    const {clerkId,frequency}=req.body;
    try{
        const existingUser=await User.findOne({clerkId});

        if(!existingUser) return res.status(404).json({message:"User doesn't exist"});

       const updatedUser= await User.findOneAndUpdate({clerkId},{frequency},{new:true});

        res.status(200).json({message:"User frequency updated successfully",user:updatedUser});
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:err.message});

    }
};

module.exports={init,updateFrequency,getFrequency};

