const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateFinancialInsights =
async (summary, categories) => {

const prompt = `
You are a financial advisor AI.

Analyze the user's financial data.

Return your response STRICTLY in this format:

SCORE: number out of 100

RATING: Excellent / Good / Fair / Poor

INSIGHTS:
- short financial analysis
- spending observations
- savings advice
- practical recommendations

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