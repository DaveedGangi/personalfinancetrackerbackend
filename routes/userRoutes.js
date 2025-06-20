const express=require("express");

const router=express.Router();



const{ init,updateFrequency, getFrequency}=require("../controllers/userController.js");


router.post("/init",init);

router.put("/update-frequency",updateFrequency);

router.get("/get-frequency",getFrequency);

module.exports=router;

