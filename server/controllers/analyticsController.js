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

exports.getAdvancedAnalytics =
async (req, res) => {

  try {

    const userId =
      req.user.userId;

    const result =
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
          ) AS total_expenses,

          COALESCE(
            AVG(
              CASE
                WHEN type = 'expense'
                THEN amount
              END
            ), 0
          ) AS average_expense

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

        LIMIT 1
        `,
        [userId]
      );

    const data =
      result.rows[0];

    const totalIncome =
      Number(data.total_income);

    const totalExpenses =
      Number(data.total_expenses);

    const savingsRate =
      totalIncome > 0
        ? (
            ((totalIncome - totalExpenses) /
              totalIncome) *
            100
          ).toFixed(1)
        : 0;

    const expenseRatio =
      totalIncome > 0
        ? (
            (totalExpenses /
              totalIncome) *
            100
          ).toFixed(1)
        : 0;

    res.status(200).json({
      totalIncome,
      totalExpenses,
      averageExpense:
        Number(data.average_expense).toFixed(2),
      highestSpendingCategory:
        categoryResult.rows[0] || null,
      savingsRate,
      expenseRatio,
    });

  } catch (error) {

    console.error(error.message);

    res.status(500).json({
      message:
        "Failed to fetch advanced analytics",
    });

  }

};

exports.getSpendingAlerts =
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
        `,
        [userId]
      );

    const totalIncome =
      Number(
        summaryResult.rows[0].total_income
      );

    const totalExpenses =
      Number(
        summaryResult.rows[0].total_expenses
      );

    const alerts = [];

    const expenseRatio =
      totalIncome > 0
        ? (totalExpenses / totalIncome) * 100
        : 0;

    if (
      totalIncome === 0 &&
      totalExpenses > 0
    ) {
      alerts.push({
        type: "danger",
        title: "No Income Recorded",
        message:
          "You have expenses recorded but no income. Add your income to get more accurate financial insights.",
      });
    }

    if (expenseRatio >= 80) {
      alerts.push({
        type: "danger",
        title: "High Expense Ratio",
        message:
          "Your expenses are above 80% of your income. Consider reducing non-essential spending.",
      });
    } else if (expenseRatio >= 50) {
      alerts.push({
        type: "warning",
        title: "Moderate Expense Ratio",
        message:
          "Your expenses are taking up more than half of your income. Keep monitoring your spending.",
      });
    }

    categoryResult.rows.forEach(
      (item) => {

        const categoryPercentage =
          totalExpenses > 0
            ? (Number(item.total) /
                totalExpenses) *
              100
            : 0;

        if (categoryPercentage >= 40) {
          alerts.push({
            type: "warning",
            title:
              `High ${item.category} Spending`,
            message:
              `${item.category} makes up ${categoryPercentage.toFixed(
                1
              )}% of your total expenses.`,
          });
        }

      }
    );

    if (
      alerts.length === 0 &&
      totalIncome > 0
    ) {
      alerts.push({
        type: "success",
        title: "Healthy Spending Pattern",
        message:
          "Your spending looks balanced based on your current income and expenses.",
      });
    }

    res.status(200).json(alerts);

  } catch (error) {

    console.error(error.message);

    res.status(500).json({
      message:
        "Failed to fetch spending alerts",
    });

  }

};