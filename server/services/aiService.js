const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateFinancialInsights =
async (summary, categories) => {

  const prompt = `
You are a financial advisor AI.

Analyze this financial data and give short actionable insights.

Financial Summary:
- Total Income: RM ${summary.totalIncome}
- Total Expenses: RM ${summary.totalExpenses}
- Balance: RM ${summary.balance}

Expense Categories:
${categories
  .map(
    (c) =>
      `${c.category}: RM ${c.total}`
  )
  .join("\n")}

Give:
- spending observations
- savings advice
- warnings if needed
- practical recommendations

Keep response concise and professional.
`;

  const completion =
    await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

  return completion.choices[0]
    .message.content;

};

module.exports = {
  generateFinancialInsights,
};