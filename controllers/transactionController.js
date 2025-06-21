const express=require("express");






const Transactions=require("../models/Transaction.js");



const addTransaction= async(req,res)=>{

    //const userId=req.auth.userId; // clerk auto extracts the userId 
    const {userId} =req.auth();

    const{amount,type,category,description,note,date}=req.body;

    try{

        const transactions=new Transactions({userId,amount,type,category,description,note,date:date || new Date()});
        await transactions.save();
        res.status(200).json({message:"Transaction saved successfully"});
       
    }
    catch(err){
        console.error(err);
        res.status(500).json({message:err.message});
    }


};



const getTransaction = async(req,res)=>{
    // const userId=req.auth.userId;
    const {userId} =req.auth();

    try{
    const allTransactions=await Transactions.find({userId}).sort({date:-1});
    res.status(200).json({transactions:allTransactions});
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:err.message});
    }


};

const deleteTransaction= async(req,res)=>{
    const {id} =req.params

    try{
        
        const particularTransaction=await Transactions.findByIdAndDelete(id);
        if(!particularTransaction) return res.status(404).json({message:"Transaction not found"});
        res.status(200).json({message:"Successfully deleted transaction"});
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:err.message});
    }
};


module.exports={addTransaction,getTransaction,deleteTransaction}