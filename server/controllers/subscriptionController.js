const pool = require("../config/db");

const Stripe = require("stripe");

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);

exports.getPlans = async (req, res) => {
  try {
    const plans = await pool.query(
      `
      SELECT
        id,
        name,
        price,
        ai_limit
      FROM subscription_plans
      ORDER BY id ASC
      `
    );

    res.status(200).json(plans.rows);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.getCurrentSubscription = async (req, res) => {
  try {
    const userId = req.user.userId;

    const subscription = await pool.query(
      `
      SELECT
        us.id,
        us.status,
        us.start_date,
        us.end_date,
        sp.id AS plan_id,
        sp.name AS plan_name,
        sp.price,
        sp.ai_limit
      FROM user_subscriptions us
      JOIN subscription_plans sp
        ON us.plan_id = sp.id
      WHERE us.user_id = $1
      ORDER BY us.id DESC
      LIMIT 1
      `,
      [userId]
    );

    if (subscription.rows.length === 0) {
      return res.status(404).json({
        message: "No subscription found",
      });
    }

    res.status(200).json(subscription.rows[0]);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.upgradeSubscription = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { planId } = req.params;

    const allowedPlans = [1, 2, 3];

    const selectedPlanId = Number(planId);

    if (!allowedPlans.includes(selectedPlanId)) {
      return res.status(400).json({
        message: "Invalid subscription plan",
      });
    }

    const planResult = await pool.query(
      `
      SELECT
        id,
        name,
        price
      FROM subscription_plans
      WHERE id = $1
      `,
      [selectedPlanId]
    );

    if (planResult.rows.length === 0) {
      return res.status(404).json({
        message: "Subscription plan not found",
      });
    }

    const currentSubscription =
    await pool.query(
      `
      SELECT plan_id
      FROM user_subscriptions
      WHERE
      user_id = $1
      AND status = 'active'
      ORDER BY id DESC
      LIMIT 1
      `,
      [userId]
    );

    if (
      currentSubscription.rows.length > 0 &&
      currentSubscription.rows[0].plan_id === selectedPlanId
    ) {
      return res.status(400).json({
        message: `You are already on the ${planResult.rows[0].name} plan`,
      });
    }

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

    const newSubscription = await pool.query(
      `
      INSERT INTO user_subscriptions
      (user_id, plan_id, status)
      VALUES ($1, $2, $3)
      RETURNING id, user_id, plan_id, status, start_date
      `,
      [
        userId,
        selectedPlanId,
        "active",
      ]
    );

    res.status(200).json({
      message: `Successfully changed to ${planResult.rows[0].name} plan`,
      subscription: newSubscription.rows[0],
    });

  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

exports.createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { plan } = req.body;

    let priceId;

    if (plan === "Pro") {
      priceId = process.env.STRIPE_PRO_PRICE_ID;
    } else if (plan === "Premium") {
      priceId = process.env.STRIPE_PREMIUM_PRICE_ID;
    } else {
      return res.status(400).json({
        message: "Invalid plan selected",
      });
    }

    const session =
      await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url:
          `${process.env.FRONTEND_URL}/pricing?success=true`,
        cancel_url:
          `${process.env.FRONTEND_URL}/pricing?canceled=true`,
        metadata: {
          userId,
          plan,
        },
      });

    res.status(200).json({
      url: session.url,
    });

  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      message: "Failed to create checkout session",
    });
  }
};