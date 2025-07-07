
const dotenv=require("dotenv");

dotenv.config();




const runEmailJob = require("./utils/runEmailJob");


const express=require("express");
const cors=require("cors");



const connectDb=require("./config/db.js");

//const runEmailScheduler=require("./cron/emailScheduler.js");

const userRoutes= require('./routes/userRoutes');
const transactions=require("./routes/transactionRoutes");



connectDb();

const app=express();

app.use(express.json());
app.use(cors());




//runEmailScheduler();

//Routes 

const PORT=process.env.PORT ||5000;

app.use('/api/users', userRoutes);
app.use("/api",transactions);



app.get("/api/trigger-email-job", async (req, res) => {
  try {
      // ✅ Respond immediately
  res.status(200).send("🚀 Email job started");

  // 🔄 Continue job after response
  runEmailJob()
    .then(() => console.log("✅ Email job completed"))
    .catch((err) => console.error("❌ Email job failed", err))

   
  } catch (err) {
    console.error("❌ Manual job trigger failed", err);
   
  }
});

app.listen(PORT,()=> console.log(`Server is running on ${PORT}`));


