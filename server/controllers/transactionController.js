const pool = require("../config/db");

exports.addTransaction = async (req, res) => {
  try {

    const userId = req.user.userId;

    const {
      type,
      category,
      amount,
      description,
      transaction_date,
    } = req.body;

    const newTransaction = await pool.query(
      `INSERT INTO transactions
      (user_id, type, category, amount, description, transaction_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        userId,
        type,
        category,
        amount,
        description,
        transaction_date,
      ]
    );

    res.status(201).json({
      message: "Transaction added successfully",
      transaction: newTransaction.rows[0],
    });

  } catch (error) {

    console.error(error.message);

    res.status(500).json({
      message: "Server error",
    });

  }
};

exports.getTransactions = async (req, res) => {
  try {

    const userId = req.user.userId;

    const transactions = await pool.query(
      `SELECT id, user_id, type, category, amount, description, TO_CHAR(transaction_date, 'YYYY-MM-DD') AS transaction_date, created_at
       FROM transactions
      WHERE user_id = $1
      ORDER BY transaction_date DESC`,
      [userId]
    );

    res.status(200).json(transactions.rows);

  } catch (error) {

    console.error(error.message);

    res.status(500).json({
      message: "Server error",
    });

  }
};

exports.deleteTransaction = async (req, res) => {
  try {

    const userId = req.user.userId;

    const { id } = req.params;

    const deletedTransaction = await pool.query(
      `DELETE FROM transactions
      WHERE id = $1 AND user_id = $2
      RETURNING *`,
      [id, userId]
    );

    if (deletedTransaction.rows.length === 0) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      message: "Transaction deleted successfully",
    });

  } catch (error) {

    console.error(error.message);

    res.status(500).json({
      message: "Server error",
    });

  }
};

exports.updateTransaction =
async (req, res) => {

  try {

    const { id } = req.params;

    const {
      type,
      category,
      amount,
      description,
      transaction_date,
    } = req.body;

    const userId =
      req.user.userId;

    const updatedTransaction =
      await pool.query(
        `
        UPDATE transactions

        SET
          type = $1,
          category = $2,
          amount = $3,
          description = $4,
          transaction_date = $5

        WHERE
          id = $6
          AND user_id = $7

        RETURNING *
        `,
        [
          type,
          category,
          amount,
          description,
          transaction_date,
          id,
          userId,
        ]
      );

    if (
      updatedTransaction.rows.length === 0
    ) {

      return res.status(404).json({
        message:
          "Transaction not found",
      });

    }

    res.status(200).json({
      message:
        "Transaction updated successfully",

      transaction:
        updatedTransaction.rows[0],
    });

  } catch (error) {

    console.error(error.message);

    res.status(500).json({
      message: "Server error",
    });

  }

};