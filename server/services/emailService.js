const { Resend } = require("resend");

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const sendVerificationEmail =
  async (email, token) => {

    const verificationUrl =
      `${process.env.FRONTEND_URL}/verify-email/${token}`;

    await resend.emails.send({
      from: "FinSight AI <noreply@kayvian.com>",
      to: email,
      subject: "Verify your FinSight AI account",
      html: `
        <h2>Welcome to FinSight AI</h2>

        <p>
          Click the button below to verify your email:
        </p>

        <a
          href="${verificationUrl}"
          style="
            display:inline-block;
            padding:12px 24px;
            background:#2563eb;
            color:white;
            text-decoration:none;
            border-radius:8px;
          "
        >
          Verify Email
        </a>
      `,
    });

  };

const sendPasswordResetEmail =
  async (email, token) => {

    const resetUrl =
      `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await resend.emails.send({
      from: "FinSight AI <noreply@kayvian.com>",
      to: email,
      subject: "Reset your FinSight AI password",
      html: `
        <h2>Password Reset Request</h2>

        <p>
          Click the button below to reset your password.
        </p>

        <a
          href="${resetUrl}"
          style="
            display:inline-block;
            padding:12px 24px;
            background:#dc2626;
            color:white;
            text-decoration:none;
            border-radius:8px;
          "
        >
          Reset Password
        </a>

        <p>
          This link expires in 1 hour.
        </p>
      `,
    });

  };

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};