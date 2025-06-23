const dotenv=require("dotenv");

const runEmailJob = require("./utils/runEmailJob");

dotenv.config();


const express=require("express");
const cors=require("cors");



const connectDb=require("./config/db.js");

const runEmailScheduler=require("./cron/emailScheduler.js");

const userRoutes= require('./routes/userRoutes');
const transactions=require("./routes/transactionRoutes");



connectDb();

const app=express();

app.use(express.json());
app.use(cors());




runEmailScheduler();

//Routes 

const PORT=process.env.PORT ||5000;

app.use('/api/users', userRoutes);
app.use("/api",transactions);






app.get("/api/trigger-email-job", async (req, res) => {
  try {
    await runEmailJob(); // this runs your existing logic
    res.status(200).send("✅ Email job executed successfully");
  } catch (err) {
    console.error("❌ Manual job trigger failed", err);
    res.status(500).send("❌ Failed to run email job");
  }
});

app.listen(PORT,()=> console.log(`Server is running on ${PORT}`));


