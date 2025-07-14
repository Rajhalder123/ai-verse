import React, { useState } from "react";
import { Sparkles, Bot } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

const CodeExplainer = () => {
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_API_KEY;

  const handleExplain = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setExplanation("⏳ Analyzing your code...");

    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [{ text: `Explain this code in simple terms:\n\n${code}` }],
            },
          ],
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const aiReply =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "🤖 I couldn't explain the code.";
      setExplanation(aiReply);
    } catch (err) {
      console.error("API Error:", err.message);
      setExplanation("❌ Failed to get explanation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-black text-white px-4 py-20 z-10 relative">
      <motion.div
        initial={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl p-6 md:p-8 rounded-3xl shadow-2xl bg-white/5 border border-slate-700 backdrop-blur-lg"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="text-yellow-400 animate-bounce" size={28} />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            🧠 Code Explainer AI
          </h1>
        </div>

        {/* Code Input */}
        <div className="mb-8">
          <label className="text-sm text-gray-300 mb-2 block font-medium">
            Paste your code below
          </label>
          <textarea
            className="w-full min-h-[160px] p-4 rounded-2xl bg-gray-800 border border-gray-600 text-sm font-mono text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder={`// Example:\nfunction greet(name) {\n  return "Hello, " + name;\n}`}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        {/* AI Explanation */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-yellow-400 mb-2">
            <Bot size={18} />
            <span className="text-sm font-medium">AI Explanation</span>
          </div>
          <div className="w-full p-4 rounded-2xl bg-gray-800 border border-gray-600 text-sm text-gray-300 min-h-[100px] whitespace-pre-wrap leading-relaxed">
            {loading
              ? "⏳ Generating explanation..."
              : explanation || "🔍 Explanation will appear here."}
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-end">
          <button
            onClick={handleExplain}
            disabled={loading || !code.trim()}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Explaining..." : "Explain Code"}
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default CodeExplainer;
