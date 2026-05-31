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

function ChatAssistant() {

  const [question, setQuestion] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const bottomRef =
  useRef(null);

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

  }, [messages]);

  const handleAsk =
    async (e) => {

      e.preventDefault();

      if (!question) return;

      try {

        setLoading(true);

        const data =
          await askFinancialAssistant(
            question
          );

        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: question,
            },
            {
                role: "assistant",
                content: data.answer,
            },
        ]);

        setQuestion("");

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

  return (
    <MainLayout>

      <div className="max-w-4xl mx-auto">

        <div className="mb-10">

          <p className="text-blue-400 font-semibold mb-2">
            AI Financial Assistant
          </p>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Ask Vayqor
          </h1>

          <p className="text-zinc-400 max-w-2xl">
            Receive AI-powered financial guidance,
            spending analysis, and budgeting insights
            based on your financial activity.
          </p>

        </div>

        {messages.length > 0 && (
            
            <div className="space-y-4">
                
                {messages.map((message, index) => (
                    
                    <div
                     key={index}
                     className={`p-6 rounded-3xl border ${
                        message.role === "user"
                        ? "bg-blue-500/10 border-blue-500/30 ml-auto max-w-2xl"
                        : "bg-zinc-900 border-zinc-800 max-w-4xl"
                     }`}
                    >
                        
                        <p className="text-sm text-zinc-500 mb-3">
                            {message.role === "user"
                            ? "You"
                            : "Vayqor"}
                        </p>

                        {message.role === "assistant" ? (
                            
                            <div className="prose prose-invert max-w-none">
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

                ))}

                <div ref={bottomRef}></div>

            </div>

            

        )}

        <form
          onSubmit={handleAsk}
          className="mt-6 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8"
        >

          <textarea
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            placeholder="Ask about your spending, savings, budgeting, or financial habits..."
            className="w-full h-40 bg-zinc-800 rounded-2xl p-5 outline-none resize-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-white text-black px-8 py-4 rounded-2xl font-bold transition duration-300 hover:scale-[1.02] disabled:opacity-50"
          >
            {loading
              ? "Thinking..."
              : "Ask AI Assistant"}
          </button>

        </form>

      </div>

    </MainLayout>
  );

}

export default ChatAssistant;