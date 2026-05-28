const pool = require("../config/db");

exports.addRecurringTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      type,
      category,
      amount,
      description,
      frequency,
      start_date,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO recurring_transactions
      (user_id, type, category, amount, description, frequency, start_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        userId,
        type,
        category,
        amount,
        description,
        frequency,
        start_date,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Failed to add recurring transaction",
    });
  }
};

exports.getRecurringTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT id, user_id, type, category, amount, description, frequency, TO_CHAR(start_date, 'YYYY-MM-DD') AS start_date, created_at
      FROM recurring_transactions
      WHERE user_id = $1
      ORDER BY created_at DESC`,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Failed to fetch recurring transactions",
    });
  }
};

exports.updateRecurringTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const {
      type,
      category,
      amount,
      description,
      frequency,
      start_date,
    } = req.body;

    const result = await pool.query(
      `UPDATE recurring_transactions
      SET
        type = $1,
        category = $2,
        amount = $3,
        description = $4,
        frequency = $5,
        start_date = $6
      WHERE id = $7 AND user_id = $8
      RETURNING *`,
      [
        type,
        category,
        amount,
        description,
        frequency,
        start_date,
        id,
        userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Recurring transaction not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Failed to update recurring transaction",
    });
  }
};

exports.deleteRecurringTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM recurring_transactions
      WHERE id = $1 AND user_id = $2
      RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Recurring transaction not found",
      });
    }

    res.status(200).json({
      message: "Recurring transaction deleted successfully",
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Failed to delete recurring transaction",
    });
  }
};