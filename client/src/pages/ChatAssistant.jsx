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

import {
  Send,
  Sparkles,
  Clock,
} from "lucide-react";

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

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAsk =
    async (e) => {
      e.preventDefault();

      if (!question.trim()) return;

      const currentQuestion =
        question.trim();

      try {
        setLoading(true);
        setLimitMessage("");

        setMessages((prev) => [
          ...prev,
          {
            role: "user",
            content: currentQuestion,
            time: getCurrentTime(),
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
            time: getCurrentTime(),
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
      <div className="max-w-6xl mx-auto h-full">

        {/* Header */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-5 sm:p-6 lg:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">

            <VayqorAIAvatar
              size="md"
              status="Online · Financial Analyst"
            />

            <div className="text-center sm:text-left">
              <p className="text-blue-400 font-semibold mb-2">
                AI Financial Assistant
              </p>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">
                Ask Vayqor
              </h1>

              <p className="text-zinc-400 max-w-2xl mt-3 leading-relaxed text-sm sm:text-base">
                Get spending analysis, budgeting ideas, saving strategies,
                and personalized financial guidance powered by AI.
              </p>
            </div>

          </div>
        </div>

        {/* Empty State */}
        {messages.length === 0 && (
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-[2rem] p-6 sm:p-8 mb-6 text-center">
            <div className="flex justify-center mb-6">
              <VayqorAIAvatar
                size="lg"
                status="Ready to analyze"
              />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              What would you like to analyze?
            </h2>

            <p className="text-zinc-400 max-w-xl mx-auto mb-8 text-sm sm:text-base">
              Choose a prompt below or ask your own financial question.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    setQuestion(prompt);
                    setLimitMessage("");
                  }}
                  className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-left text-zinc-300 hover:text-white hover:border-blue-500/40 hover:bg-zinc-800/80 transition text-sm sm:text-base"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div className="space-y-6 mb-6">

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="hidden sm:block mr-3 mt-2">
                    <VayqorAIAvatar
                      size="sm"
                      status="Vayqor AI"
                    />
                  </div>
                )}

                <div
                  className={`rounded-3xl border ${
                    message.role === "user"
                      ? "bg-blue-500/10 border-blue-500/30 px-5 py-4 max-w-[90%] sm:max-w-[75%] lg:max-w-[55%]"
                      : "bg-zinc-900 border-zinc-800 px-5 py-5 sm:px-6 sm:py-6 max-w-[95%] sm:max-w-[82%] lg:max-w-[70%]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <p
                      className={`text-sm font-semibold ${
                        message.role === "user"
                          ? "text-blue-400"
                          : "text-blue-400"
                      }`}
                    >
                      {message.role === "user"
                        ? "You"
                        : "Vayqor AI"}
                    </p>

                    <div className="flex items-center gap-1 text-xs text-zinc-600">
                      <Clock size={12} />
                      {message.time || ""}
                    </div>
                  </div>

                  {message.role === "assistant" ? (
                    <div className="prose prose-invert max-w-none prose-p:text-zinc-300 prose-p:leading-relaxed prose-li:text-zinc-300 prose-strong:text-white prose-headings:text-white">
                      <ReactMarkdown>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-zinc-100 text-sm sm:text-base leading-relaxed">
                      {message.content}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="hidden sm:block mr-3 mt-2">
                  <VayqorAIAvatar
                    size="sm"
                    status="Thinking..."
                  />
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl px-5 py-5 sm:px-6 max-w-[95%] sm:max-w-[75%]">
                  <div className="flex items-center gap-4">
                    <div className="sm:hidden">
                      <VayqorAIAvatar
                        size="sm"
                        status="Thinking..."
                      />
                    </div>

                    <div>
                      <p className="text-blue-400 font-semibold">
                        Vayqor is analyzing...
                      </p>

                      <div className="flex items-center gap-2 mt-2 text-zinc-500 text-sm">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.15s]" />
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.3s]" />
                        <span>
                          Checking your financial patterns
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef}></div>
          </div>
        )}

        {/* Limit Message */}
        {limitMessage && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-3xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <VayqorAIAvatar
                size="sm"
                status="Upgrade Required"
              />

              <div className="flex-1">
                <p className="text-blue-400 font-semibold mb-2">
                  Upgrade Required
                </p>

                <h2 className="text-xl sm:text-2xl font-bold mb-3">
                  You’ve reached your free AI message limit
                </h2>

                <p className="text-zinc-400 mb-5">
                  {limitMessage}
                </p>

                <a
                  href="/pricing"
                  className="inline-block bg-white text-black px-6 py-3 rounded-2xl font-bold transition duration-300 hover:scale-[1.02]"
                >
                  Upgrade to Pro
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Input */}
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
            placeholder="Ask Vayqor about your spending, savings, budgeting, or financial habits..."
            className="w-full h-24 sm:h-28 bg-zinc-800 rounded-2xl p-4 outline-none resize-none text-zinc-100 placeholder:text-zinc-500 text-sm sm:text-base"
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Sparkles size={14} />
              <span>
                AI guidance only. Not financial advice.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black px-7 py-3 rounded-2xl font-bold transition duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Thinking..."
                : "Send"}
              <Send size={18} />
            </button>
          </div>
        </form>

      </div>
    </MainLayout>
  );
}

export default ChatAssistant;