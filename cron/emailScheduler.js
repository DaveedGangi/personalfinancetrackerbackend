const cron = require("node-cron");
const User = require("../models/User.js");
const sendEmail = require("../utils/emailSender.js");

const {
  getStartOfDay,
  getEndOfDay,
  getStartOfMonth,
  isLastDayOfMonth,
} = require("../utils/dateUtils.js");


const Transaction = require("../models/Transaction.js");

const runEmailScheduler = () => {

  // Runs every day at 10 PM
  cron.schedule("0 22 * * *", async () => {
    console.log("🔄 Cron job triggered");

    try {
      const users = await User.find({ frequency: { $ne: "none" } });
      console.log(`👥 Found ${users.length} user(s) with active frequency`);

      for (const user of users) {
        let startDate, endDate;

        if (user.frequency === "daily") {
          startDate = getStartOfDay();
          endDate = getEndOfDay();

          console.log(`📅 Preparing DAILY report for ${user.email}`);

        } else if (user.frequency === "monthly" && isLastDayOfMonth()) {
          startDate = getStartOfMonth();
          endDate = getEndOfDay();

          console.log(`📆 Preparing MONTHLY report for ${user.email}`);
        } else {
          console.log(`⏭️ Skipping ${user.email} - No matching schedule`);
          continue;
        }

        const transactions = await Transaction.find({
          userId: user._id,
          date: { $gte: startDate, $lte: endDate },
        });

        if (transactions.length === 0) {
          console.log(`📭 No transactions for ${user.email}, skipping email.`);
          continue;
        }

        const totalIncome = transactions
          .filter((txn) => txn.category === "income")
          .reduce((sum, txn) => sum + txn.amount, 0);

        const totalExpense = transactions
          .filter((txn) => txn.category === "expense")
          .reduce((sum, txn) => sum + txn.amount, 0);

        const html = `
          <div style="font-family: Arial, sans-serif; font-size: 15px;">
            <p>Hi <strong>${user.email}</strong>,</p>
            <p>Here is your <strong>${user.frequency}</strong> transaction report:</p>
            <ul>
              <li>🟢 <strong>Total Income:</strong> ₹${totalIncome}</li>
              <li>🔴 <strong>Total Expense:</strong> ₹${totalExpense}</li>
              <li>🧾 <strong>Transaction Count:</strong> ${transactions.length}</li>
            </ul>
            <p>Thanks for using <strong>Personal Finance Tracker</strong>! 💰</p>
          </div>
        `;

        await sendEmail(
          user.email,
          `Your ${user.frequency} transaction report!`,
          html
        );
        console.log(`✅ Email sent to ${user.email}`);
      }
    } catch (err) {
      console.error("❌ Email scheduler error:", err);
    }
  });
};




module.exports = runEmailScheduler;
