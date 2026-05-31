const pool = require("../config/db");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.askFinancialAssistant =
async (req, res) => {

  try {

    const userId =
      req.user.userId;

    const { question } =
      req.body;

    if (!question) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    const summaryResult =
      await pool.query(
        `
        SELECT
          COALESCE(
            SUM(
              CASE
                WHEN type = 'income'
                THEN amount
                ELSE 0
              END
            ), 0
          ) AS total_income,

          COALESCE(
            SUM(
              CASE
                WHEN type = 'expense'
                THEN amount
                ELSE 0
              END
            ), 0
          ) AS total_expenses
        FROM transactions
        WHERE user_id = $1
        `,
        [userId]
      );

    const categoryResult =
      await pool.query(
        `
        SELECT
          category,
          SUM(amount) AS total
        FROM transactions
        WHERE
          user_id = $1
          AND type = 'expense'
        GROUP BY category
        ORDER BY total DESC
        LIMIT 5
        `,
        [userId]
      );

    const summary =
      summaryResult.rows[0];

    const financialContext = {
      totalIncome: summary.total_income,
      totalExpenses: summary.total_expenses,
      balance:
        Number(summary.total_income) -
        Number(summary.total_expenses),
      topExpenseCategories:
        categoryResult.rows,
    };

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              `You are Vayqor, a helpful financial assistant.
              Give practical, simple, non-judgmental money advice.
              Use the user's financial data when relevant.
              Do not give legal, tax, or investment guarantees.`,
          },
          {
            role: "user",
            content:
              `Financial data:
              ${JSON.stringify(financialContext)}

              User question:
              ${question}`,
          },
        ],
      });

    const aiAnswer = completion.choices[0].message.content;

    await pool.query(
        `INSERT INTO chat_messages
        (user_id, role, content)
        VALUES ($1, $2, $3)`,
        [userId, "user", question]
    );

    await pool.query(
        `INSERT INTO chat_messages
        (user_id, role, content)
        VALUES ($1, $2, $3)`,
        [userId, "assistant", aiAnswer]
    );

    res.status(200).json({
        answer: aiAnswer,
    });

  } catch (error) {

    console.error(error.message);

    res.status(500).json({
      message:
        "Failed to get financial assistant response",
    });

  }

};

exports.getChatHistory =
async (req, res) => {

  try {

    const userId =
      req.user.userId;

    const result =
      await pool.query(
        `
        SELECT
          role,
          content,
          created_at
        FROM chat_messages
        WHERE user_id = $1
        ORDER BY created_at ASC
        `,
        [userId]
      );

    res.status(200).json(
      result.rows
    );

  } catch (error) {

    console.error(error.message);

    res.status(500).json({
      message:
        "Failed to fetch chat history",
    });

  }

};