function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white px-6 md:px-20 py-16">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Privacy Policy
        </h1>

        <p className="text-zinc-400 mb-10">
          Last updated: 2026
        </p>

        <div className="space-y-8 text-zinc-300 leading-relaxed">

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">
              1. Information We Collect
            </h2>
            <p>
              Vayqor collects account information such as your username,
              email address, and financial data you choose to enter, including
              transactions, savings goals, recurring transactions, receipt data,
              and AI chat history.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">
              2. How We Use Your Information
            </h2>
            <p>
              We use your information to provide financial tracking, analytics,
              forecasting, AI-powered insights, receipt scanning, account
              authentication, email verification, and password recovery.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">
              3. Data Security
            </h2>
            <p>
              We use authentication, encrypted passwords, protected routes, and
              secure database storage to help protect user information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">
              4. Third-Party Services
            </h2>
            <p>
              Vayqor uses third-party services such as OpenAI, Resend,
              Vercel, Render, Neon PostgreSQL, and Cloudflare to operate the
              platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">
              5. Contact
            </h2>
            <p>
              For privacy-related questions, contact us at support@kayvian.com.
            </p>
          </section>

        </div>

      </div>

    </div>
  );
}

export default PrivacyPolicy;