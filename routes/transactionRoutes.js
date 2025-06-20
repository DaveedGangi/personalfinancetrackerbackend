const express=require("express");
const router=express.Router();

// const { requireAuth } = require("@clerk/clerk-sdk-node");

const { requireAuth } = require("@clerk/express");

const {addTransaction,getTransaction,deleteTransaction}=require("../controllers/transactionController.js");

router.post("/transactions",requireAuth(),addTransaction);

router.get("/transactions",requireAuth(),getTransaction);

router.delete("/transactions/:id",requireAuth(),deleteTransaction);

module.exports=router