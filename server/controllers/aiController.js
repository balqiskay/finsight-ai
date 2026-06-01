const pool = require("../config/db");

const {
  generateFinancialInsights,
} = require("../services/aiService");

const getAIInsights =
async (req, res) => {

  try {

    const userId =
      req.user.userId;

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

      const usageCount = Number(usageResult.rows[0].usage_count);

      if (usageCount >= aiLimit) {
        return res.status(403).json({
          message:
          "You have reached your monthly AI limit. Upgrade to Pro to continue using AI insights.",
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
            ),
            0
          ) AS total_income,

          COALESCE(
            SUM(
              CASE
                WHEN type = 'expense'
                THEN amount
                ELSE 0
              END
            ),
            0
          ) AS total_expenses

        FROM transactions

        WHERE user_id = $1
        `,
        [userId]
      );

    const summary =
      summaryResult.rows[0];

    const balance =
      Number(summary.total_income) -
      Number(summary.total_expenses);

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
        `,
        [userId]
      );

    const insights =
    await generateFinancialInsights(
      {
        totalIncome:
        summary.total_income,

        totalExpenses:
        summary.total_expenses,

        balance,
      },

      categoryResult.rows
    );
    
    await pool.query(
      `
      INSERT INTO chat_messages
      (user_id, role, content)
      VALUES ($1, $2, $3)
      `,
      [
        userId,
        "assistant",
        insights,
      ]
    );

    res.json({
      insights,
      plan: subscription.plan_name,
      aiLimit,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Failed to generate AI insights",
    });

  }

};

module.exports = {
  getAIInsights,
};