const cron = require("node-cron");
const User = require("../models/User.js");
const Transaction = require("../models/Transaction.js");
const sendEmail = require("../utils/emailSender.js");

const {
  getStartOfDay,
  getEndOfDay,
  getStartOfMonth,
  isLastDayOfMonth,
} = require("../utils/dateUtils.js");

const runEmailScheduler = () => {
  // Runs every day at 10 PM IST
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
          userId: user.clerkId,
          date: { $gte: startDate, $lte: endDate },
        });

        if (transactions.length === 0) {
          console.log(`📭 No transactions for ${user.email}, skipping email.`);
          continue;
        }

        const formatAmount = (amt) =>
          amt.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

        const totalIncomeRaw = transactions
          .filter((txn) => txn.type === "income")
          .reduce((sum, txn) => sum + txn.amount, 0);

        const totalExpenseRaw = transactions
          .filter((txn) => txn.type === "expense")
          .reduce((sum, txn) => sum + txn.amount, 0);

        const totalIncome = formatAmount(totalIncomeRaw);
        const totalExpense = formatAmount(totalExpenseRaw);

        const reportDate = new Date().toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        const html = `
          <div style="font-family: 'Segoe UI', sans-serif; color: #1c1c1c; max-width: 600px; margin: 0 auto; padding: 16px; background: #f4f7fa;">
            <div style="background: #ffffff; border-radius: 12px; padding: 20px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
              <p style="text-align: right; font-size: 13px; color: #555;">📅 ${reportDate}</p>

              <h2 style="font-size: 18px; color: #0b1c39; margin-bottom: 16px; text-align: center;">
                💼 Personal Finance Report
              </h2>

              <p style="font-size: 15px;">Hi <strong style="color: #007bff;">${user.email}</strong>,</p>
              <p style="font-size: 15px; margin-bottom: 20px;">
                Here’s your <strong style="color: #28a745;">${user.frequency.toUpperCase()}</strong> transaction summary:
              </p>

              <div style="background-color: #f0f4ff; border: 1px solid #e3eaf5; padding: 14px 16px; border-radius: 8px; font-size: 14px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span>🟢 <strong>Total Income:</strong></span>
                  <span style="font-weight: 600; color: #28a745;">${totalIncome}</span>
                </div>
                <div style="border-top: 1px solid #ddd; margin: 8px 0;"></div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span>🔴 <strong>Total Expense:</strong></span>
                  <span style="font-weight: 600; color: #dc3545;">${totalExpense}</span>
                </div>
                <div style="border-top: 1px solid #ddd; margin: 8px 0;"></div>
                <div style="display: flex; justify-content: space-between;">
                  <span>📄 <strong>Transactions:</strong></span>
                  <span style="font-weight: 600;">${transactions.length}</span>
                </div>
              </div>

              <p style="font-size: 14px; margin-top: 20px;">
                Thank you for using <strong style="color: #0b1c39;">Personal Finance Tracker</strong>! 💰<br/>
                <em style="color: #666;">Stay consistent and take control of your finances.</em>
              </p>

              <p style="font-size: 12px; color: #999; text-align: center; margin-top: 24px;">
                You are receiving this email because your report frequency is set to <strong>${user.frequency}</strong>.
              </p>
            </div>
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
  }, {
    timezone: "Asia/Kolkata",
  });
};



module.exports = runEmailScheduler;
