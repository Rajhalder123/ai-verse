import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm your free AI assistant 🤖" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = { sender: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: trimmed }] }],
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const reply =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "🤖 I couldn't generate a response.";
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (error) {
      console.error("API error:", error.message);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "❌ Failed to fetch AI response. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-slate-900 to-black text-white px-4 md:px-12 py-10 mt-12">
      <motion.div
        initial={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl p-6 md:p-8 rounded-3xl shadow-2xl bg-white/5 border border-slate-700 backdrop-blur"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="text-yellow-400 animate-pulse" size={28} />
          <h1 className="text-2xl font-bold tracking-tight">
            🤖 AI ChatBot Assistant
          </h1>
        </div>

        {/* Chat Messages */}
        <div className="h-[300px] overflow-y-auto space-y-3 bg-gray-900/30 rounded-xl border border-gray-700 p-4 mb-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-[75%] text-sm whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-xl text-sm text-gray-800 dark:text-white animate-pulse">
                AI is thinking...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Field */}
        <div className="flex">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-l-xl border border-gray-600 bg-gray-800 text-white placeholder-gray-400 resize-none focus:outline-none text-sm"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-xl font-semibold text-sm disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatBot;
