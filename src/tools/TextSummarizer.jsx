import React, { useState } from "react";
import { Bot, FileText, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

const TextSummarizer = () => {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_API_KEY;

  const handleSummarize = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setSummary("⏳ Summarizing your text...");

    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Summarize this text in simple and clear language:\n\n${inputText}`,
                },
              ],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const reply =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "🤖 I couldn't generate a summary.";
      setSummary(reply);
    } catch (error) {
      console.error("Summarization Error:", error.message);
      setSummary("❌ Failed to summarize. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-black text-white px-4 py-12">
      <motion.div
        initial={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl p-8 rounded-3xl shadow-2xl bg-white/5 border border-slate-700 backdrop-blur"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="text-blue-400 animate-pulse" size={28} />
          <h1 className="text-2xl font-bold tracking-tight">
            📝 Text Summarizer Tool
          </h1>
        </div>

        {/* Text Input */}
        <div className="mb-6">
          <label className="text-sm text-gray-300 mb-2 block">
            Paste your text below
          </label>
          <textarea
            className="w-full h-40 p-4 rounded-lg bg-gray-800 border border-gray-600 text-sm text-white font-mono placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste a paragraph or article here to summarize..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        {/* Summary Output */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <Bot size={18} />
            <span className="text-sm">AI Summary</span>
          </div>
          <div className="w-full p-4 rounded-lg bg-gray-800 border border-gray-600 text-sm text-gray-300 min-h-[80px] whitespace-pre-wrap">
            {loading
              ? "⏳ Generating summary..."
              : summary || "🧠 Your summary will appear here."}
          </div>
        </div>

        {/* Summarize Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSummarize}
            disabled={loading || !inputText.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Summarizing..." : "Summarize Text"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TextSummarizer;
