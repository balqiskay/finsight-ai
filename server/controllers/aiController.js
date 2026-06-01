const pool = require("../config/db");

const {
  generateFinancialInsights,
} = require("../services/aiService");

const getAIInsights =
async (req, res) => {

  try {

    const userId =
      req.user.userId;

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

    res.json({
      insights,
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