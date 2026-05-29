const { Resend } = require("resend");

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const sendVerificationEmail =
  async (email, token) => {

    const verificationUrl =
      `${process.env.FRONTEND_URL}/verify-email/${token}`;

    await resend.emails.send({
      from: "onboarding@resend.dev",
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

module.exports = {
  sendVerificationEmail,
};