const pool = require("../config/db");

exports.getFinancialSummary = async (req, res) => {
  try {

    const userId = req.user.userId;

    const incomeResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total_income
       FROM transactions
       WHERE user_id = $1 AND type = 'income'`,
      [userId]
    );

    const expenseResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total_expenses
       FROM transactions
       WHERE user_id = $1 AND type = 'expense'`,
      [userId]
    );

    const totalIncome = parseFloat(
      incomeResult.rows[0].total_income
    );

    const totalExpenses = parseFloat(
      expenseResult.rows[0].total_expenses
    );

    const balance = totalIncome - totalExpenses;

    res.status(200).json({
      totalIncome,
      totalExpenses,
      balance,
    });

  } catch (error) {

    console.error(error.message);

    res.status(500).json({
      message: "Server error",
    });

  }
};

exports.getCategoryBreakdown = async (req, res) => {
  try {

    const userId = req.user.userId;

    const categoryData = await pool.query(
      `SELECT category,
      SUM(amount) AS total
      FROM transactions
      WHERE user_id = $1
      AND type = 'expense'
      GROUP BY category
      ORDER BY total DESC`,
      [userId]
    );

    res.status(200).json(categoryData.rows);

  } catch (error) {

    console.error(error.message);

    res.status(500).json({
      message: "Server error",
    });

  }
};

exports.getMonthlyAnalytics =
async (req, res) => {

  try {

    const userId =
      req.user.userId;

    const result =
      await pool.query(
        `
        SELECT

          TO_CHAR(
            transaction_date,
            'Mon'
          ) AS month,

          SUM(
            CASE
              WHEN type = 'income'
              THEN amount
              ELSE 0
            END
          ) AS income,

          SUM(
            CASE
              WHEN type = 'expense'
              THEN amount
              ELSE 0
            END
          ) AS expenses

        FROM transactions

        WHERE user_id = $1

        GROUP BY
          TO_CHAR(
            transaction_date,
            'Mon'
          ),
          EXTRACT(
            MONTH
            FROM transaction_date
          )

        ORDER BY
          EXTRACT(
            MONTH
            FROM transaction_date
          )
        `,
        [userId]
      );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message:
        "Failed to fetch monthly analytics",
    });

  }

};