const pool = require("../config/db");

exports.addGoal = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      goal_name,
      target_amount,
      current_amount,
      deadline,
    } = req.body;

    if (!goal_name || !target_amount) {
        return res.status(400).json({
            message: "Goal name and target amount are required",
        });
    }

    if (Number(target_amount) <= 0) {
        return res.status(400).json({
            message: "Target amount must be greater than 0",
        });
    }

    if (current_amount && Number(current_amount) < 0) {
        return res.status(400).json({
            message: "Current amount cannot be negative",
        });
    }

    if (
        current_amount &&
        Number(current_amount) > Number(target_amount)
    ) {
        return res.status(400).json({
            message: "Current amount cannot exceed target amount",
        });
    }

    const result = await pool.query(
      `INSERT INTO savings_goals
      (user_id, goal_name, target_amount, current_amount, deadline)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        userId,
        goal_name,
        target_amount,
        current_amount || 0,
        deadline || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Failed to add savings goal",
    });
  }
};

exports.getGoals = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `SELECT * FROM savings_goals
      WHERE user_id = $1
      ORDER BY created_at DESC`,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Failed to fetch savings goals",
    });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const {
      goal_name,
      target_amount,
      current_amount,
      deadline,
    } = req.body;

    if (!goal_name || !target_amount) {
        return res.status(400).json({
            message: "Goal name and target amount are required",
        });
    }

    if (Number(target_amount) <= 0) {
        return res.status(400).json({
            message: "Target amount must be greater than 0",
        });
    }

    if (current_amount && Number(current_amount) < 0) {
        return res.status(400).json({
            message: "Current amount cannot be negative",
        });
    }

    if (
        current_amount &&
        Number(current_amount) > Number(target_amount)
    ) {
        return res.status(400).json({
            message: "Current amount cannot exceed target amount",
        });
    }

    const result = await pool.query(
      `UPDATE savings_goals
      SET
        goal_name = $1,
        target_amount = $2,
        current_amount = $3,
        deadline = $4
      WHERE id = $5 AND user_id = $6
      RETURNING *`,
      [
        goal_name,
        target_amount,
        current_amount,
        deadline || null,
        id,
        userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Savings goal not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Failed to update savings goal",
    });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM savings_goals
      WHERE id = $1 AND user_id = $2
      RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Savings goal not found",
      });
    }

    res.status(200).json({
      message: "Savings goal deleted successfully",
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Failed to delete savings goal",
    });
  }
};