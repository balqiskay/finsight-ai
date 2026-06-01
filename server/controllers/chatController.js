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

    const subscriptionResult =
    await pool.query(
      `
      SELECT
      sp.name AS plan_name,
      sp.ai_limit
      FROM user_subscriptions us
      JOIN subscription_plans sp
      ON us.plan_id = sp.id
      WHERE
      us.user_id = $1
      AND us.status = 'active'
      ORDER BY us.id DESC
      LIMIT 1
      `,
      [userId]
    );

    if (subscriptionResult.rows.length === 0) {
      return res.status(403).json({
        message: "No active subscription found",
      });
    }

    const subscription = subscriptionResult.rows[0];

    const aiLimit =
    subscription.ai_limit === null
    ? null
    : Number(subscription.ai_limit);

    if (aiLimit !== null) {
      const usageResult =
      await pool.query(
        `
        SELECT COUNT(*) AS usage_count
        FROM chat_messages
        WHERE
        user_id = $1
        AND role = 'assistant'
        AND created_at >= date_trunc('month', CURRENT_DATE)
        `,
        [userId]
      );

      const usageCount =
      Number(usageResult.rows[0].usage_count);

      console.log("AI LIMIT DEBUG:", {
        userId,
        plan: subscription.plan_name,
        aiLimit,
        usageCount,
      });

      if (usageCount >= aiLimit) {
        return res.status(403).json({
          message:
          "You have reached your monthly AI message limit. Upgrade to Pro to continue using Ask Vayqor.",
        });
      }
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