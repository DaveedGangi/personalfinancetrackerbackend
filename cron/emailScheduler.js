
const cron=require("node-cron");


const User=require("../models/User.js");


const sendEmail=require("../utils/emailSender.js");

const {getStartOfDay,getEndOfDay,getStartOfMonth,isLastDayOfMonth} =require("../utils/dateUtils.js");
const Transaction = require("../models/Transaction.js");


const runEmailScheduler=()=>{
    
    cron.schedule("0 22 * * *", async()=>{

        try{

            const users=await User.find({frequency:{$ne:"none"}})
            
            for (const user of users){

                let startDate
                let endDate

                if(user.frequency==="daily"){
                    startDate=getStartOfDay();
                    endDate=getEndOfDay();
                }
                else if(user.frequency==="monthly" && isLastDayOfMonth()){
                    startDate=getStartOfMonth();
                    endDate=getEndOfDay();
                }
                else{
                    continue;
                }

            


const transactions=await Transaction.find({
    userId:user._id,
    date:{$gte:startDate,$lte:endDate}
})

const totalIncome=transactions.filter((txn)=>txn.category==="income").reduce((sum,txn)=>sum+txn.amount,0);

const totalExpense=transactions.filter((txn)=>txn.category==="expense").reduce((sum,txn)=>sum+txn.amount,0);


const body=`
Hi ${user.email} 

Here is your ${user.frequency} report: 

🟢 Total Income : ${totalIncome}
🔴 Total Expense : ${totalExpense}
🧾 Transaction Count : ${transactions.length} 

Thanks for using our app! 

`;


await sendEmail(user.email,`Your ${user.frequency} transaction report! `,body);


            }
            

        }
        catch(err){
            console.error("Email scheduler error:",err);
        }

    })


}

module.exports=runEmailScheduler;