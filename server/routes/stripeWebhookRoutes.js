const express = require("express");
const Stripe = require("stripe");
const pool = require("../config/db");

const router = express.Router();

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);

router.post(
  "/webhook",
  express.raw({
    type: "application/json",
  }),
  async (req, res) => {
    const sig =
      req.headers["stripe-signature"];

    let event;

    try {
      event =
        stripe.webhooks.constructEvent(
          req.body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
      console.error(
        "Webhook signature verification failed:",
        error.message
      );

      return res.status(400).send(
        `Webhook Error: ${error.message}`
      );
    }

    try {
      if (
        event.type ===
        "checkout.session.completed"
      ) {
        const session =
          event.data.object;

        const userId =
          Number(session.metadata.userId);

        const plan =
          session.metadata.plan;

        let planId;

        if (plan === "Pro") {
          planId = 2;
        } else if (plan === "Premium") {
          planId = 3;
        }

        if (userId && planId) {
          await pool.query(
            `
            UPDATE user_subscriptions
            SET
              status = 'inactive',
              end_date = CURRENT_TIMESTAMP
            WHERE
              user_id = $1
              AND status = 'active'
            `,
            [userId]
          );

          await pool.query(
            `
            INSERT INTO user_subscriptions
            (user_id, plan_id, status)
            VALUES ($1, $2, $3)
            `,
            [
              userId,
              planId,
              "active",
            ]
          );
        }
      }

      res.status(200).json({
        received: true,
      });

    } catch (error) {
      console.error(
        "Webhook processing error:",
        error.message
      );

      res.status(500).json({
        message: "Webhook processing failed",
      });
    }
  }
);

module.exports = router;