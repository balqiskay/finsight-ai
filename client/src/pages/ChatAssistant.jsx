import {
  useEffect,
  useRef,
  useState,
} from "react";

import MainLayout from "../layouts/MainLayout";

import {
  askFinancialAssistant,
  getChatHistory,
} from "../services/chatService";

import ReactMarkdown from "react-markdown";
import VayqorAIAvatar from "../components/VayqorAIAvatar";

function ChatAssistant() {
  const [question, setQuestion] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [limitMessage, setLimitMessage] =
    useState("");

  const bottomRef =
    useRef(null);

  const prompts = [
    "How can I save more money this month?",
    "Analyze my spending habits.",
    "Help me create a better budget.",
    "What expenses should I reduce first?",
  ];

  useEffect(() => {
    const loadHistory =
      async () => {
        try {
          const data =
            await getChatHistory();

          setMessages(data);
        } catch (error) {
          console.error(error);
        }
      };

    loadHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const handleAsk =
    async (e) => {
      e.preventDefault();

      if (!question.trim()) return;

      const currentQuestion =
        question;

      try {
        setLoading(true);
        setLimitMessage("");

        setMessages((prev) => [
          ...prev,
          {
            role: "user",
            content: currentQuestion,
          },
        ]);

        setQuestion("");

        const data =
          await askFinancialAssistant(
            currentQuestion
          );

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.answer,
          },
        ]);
      } catch (error) {
        console.error(error);

        const message =
          error?.response?.data?.message ||
          "Failed to get AI response.";

        setLimitMessage(message);
      } finally {
        setLoading(false);
      }
    };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-8">

        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">

            <VayqorAIAvatar
              size="md"
              status="Online · Financial Analyst"
            />

            <div>
              <p className="text-blue-400 font-semibold mb-2">
                AI Financial Assistant
              </p>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
                Ask Vayqor
              </h1>

              <p className="text-zinc-400 max-w-2xl leading-relaxed">
                Get AI-powered financial guidance, spending analysis,
                budgeting ideas, and money recommendations based on your data.
              </p>
            </div>

          </div>
        </div>

        {messages.length === 0 && (
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-[2rem] p-8 text-center">
            <div className="flex justify-center mb-6">
              <VayqorAIAvatar
                size="lg"
                status="Ready to analyze"
              />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              What would you like to analyze?
            </h2>

            <p className="text-zinc-400 max-w-xl mx-auto mb-8">
              Choose a prompt below or ask your own financial question.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() =>
                    setQuestion(prompt)
                  }
                  className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-left text-zinc-300 hover:text-white hover:border-blue-500/40 hover:bg-zinc-800/80 transition"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <div className="space-y-5">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`p-5 sm:p-6 rounded-3xl border max-w-[90%] md:max-w-[75%] ${
                    message.role === "user"
                      ? "bg-blue-500/10 border-blue-500/30"
                      : "bg-zinc-900 border-zinc-800"
                  }`}
                >
                  <p className="text-sm text-zinc-500 mb-3">
                    {message.role === "user"
                      ? "You"
                      : "Vayqor AI"}
                  </p>

                  {message.role === "assistant" ? (
                    <div className="prose prose-invert max-w-none prose-p:text-zinc-300 prose-li:text-zinc-300">
                      <ReactMarkdown>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-zinc-200">
                      {message.content}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-[90%] md:max-w-[75%]">
                <div className="flex items-center gap-4">
                  <VayqorAIAvatar
                    size="sm"
                    status="Thinking..."
                  />

                  <div>
                    <p className="text-blue-400 font-semibold">
                      Vayqor is analyzing...
                    </p>

                    <p className="text-zinc-500 text-sm mt-1">
                      Checking your financial patterns and preparing a response.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef}></div>
          </div>
        )}

        {limitMessage && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-3xl p-6">
            <p className="text-blue-400 font-semibold mb-2">
              Upgrade Required
            </p>

            <h2 className="text-2xl font-bold mb-3">
              You’ve reached your free AI message limit
            </h2>

            <p className="text-zinc-400 mb-6">
              {limitMessage}
            </p>

            <a
              href="/pricing"
              className="inline-block bg-white text-black px-6 py-3 rounded-2xl font-bold transition duration-300 hover:scale-[1.02]"
            >
              Upgrade to Pro
            </a>
          </div>
        )}

        <form
          onSubmit={handleAsk}
          className="sticky bottom-4 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-[2rem] p-4 sm:p-5 shadow-2xl"
        >
          <textarea
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              setLimitMessage("");
            }}
            placeholder="Ask about your spending, savings, budgeting, or financial habits..."
            className="w-full h-28 bg-zinc-800 rounded-2xl p-4 outline-none resize-none text-zinc-100 placeholder:text-zinc-500"
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
            <p className="text-xs text-zinc-500">
              Vayqor can make mistakes. Use insights as guidance, not financial advice.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="bg-white text-black px-7 py-3 rounded-2xl font-bold transition duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Thinking..."
                : "Ask AI Assistant"}
            </button>
          </div>
        </form>

      </div>
    </MainLayout>
  );
}

export default ChatAssistant;