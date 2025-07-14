import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import jsPDF from "jspdf";
import { Sparkles, FileText, Bot } from "lucide-react";

const topics = [
  "variables",
  "functions",
  "loops",
  "promises",
  "arrays",
  "objects",
  "scope",
  "DOM manipulation",
  "events",
  "ES6 features"
];

const getRandomTopic = () => topics[Math.floor(Math.random() * topics.length)];

const StudentMCQExam = () => {
  const [step, setStep] = useState(1);
  const [questionCount, setQuestionCount] = useState(0);
  const [score, setScore] = useState(0);
  const [mcq, setMcq] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [history, setHistory] = useState([]);

  const apiKey = import.meta.env.VITE_API_KEY;
  const maxQuestions = 10;
  const questionTimeLimit = 30;

  const startExam = async () => {
    setLoading(true);
    setSelectedOption("");
    setFeedback("");

    try {
      const topic = getRandomTopic();
      const prompt = `Generate a short JavaScript multiple-choice question about "${topic}" with 3 options and one correct answer. Return JSON only with the keys: question, options (array of 3), and answer.`;

      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        { headers: { "Content-Type": "application/json" } }
      );

      let raw = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      raw = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(raw);

      setMcq(parsed);
      setTimeLeft(questionTimeLimit);
      setStep(2);
    } catch (error) {
      console.error("Failed to fetch MCQ:", error);
      setMcq({
        question: "❌ Failed to load question. Check your API key.",
        options: [],
        answer: ""
      });
    } finally {
      setLoading(false);
    }
  };

const handleSubmit = () => {
  if (!selectedOption || !mcq) return;

  const correct = selectedOption === mcq.answer;
  setScore((prev) => (correct ? prev + 1 : prev));
  setFeedback(correct ? "✅ Correct!" : `❌ Incorrect. Correct answer: ${mcq.answer}`);

  setHistory((prev) => [
    ...prev,
    {
      question: mcq.question,
      selected: selectedOption,
      correct: mcq.answer,
      result: correct ? "Correct" : "Incorrect"
    }
  ]);

  setTimeLeft(0);

  // Wait for feedback to be shown before calling next question
  setTimeout(() => {
    loadNextQuestionSafely();
  }, 1500);
};


useEffect(() => {
  if (step !== 2 || feedback || !mcq) return;

  if (timeLeft === 0) {
    setFeedback(`⏰ Time's up! Correct answer: ${mcq.answer}`);

    setHistory((prev) => [
      ...prev,
      {
        question: mcq.question,
        selected: "No Answer",
        correct: mcq.answer,
        result: "Timed Out"
      }
    ]);

    setTimeout(() => {
      loadNextQuestionSafely();
    }, 1500);

    return;
  }

  const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
  return () => clearTimeout(timer);
}, [timeLeft, step, feedback, mcq]);

const loadNextQuestionSafely = async () => {
  if (questionCount + 1 >= maxQuestions) {
    setStep(3);
    return;
  }

  setQuestionCount((prev) => prev + 1);
  setLoading(true);

  try {
    const topic = getRandomTopic();
    const prompt = `Generate a short JavaScript multiple-choice question about "${topic}" with 3 options and one correct answer. Return JSON only with the keys: question, options (array of 3), and answer.`;

    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    let raw = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    raw = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(raw);

    setMcq(parsed);
    setSelectedOption("");
    setFeedback("");
    setTimeLeft(questionTimeLimit);
  } catch (error) {
    console.error("Failed to fetch next MCQ:", error);
    setMcq({
      question: "❌ Failed to load next question. Check your API key.",
      options: [],
      answer: ""
    });
  } finally {
    setLoading(false);
  }
};
{loading && (
  <div className="text-center text-blue-400 text-sm mb-4">
    🔄 Loading next question...
  </div>
)}

  
  const restart = () => {
    setStep(1);
    setScore(0);
    setQuestionCount(0);
    setSelectedOption("");
    setFeedback("");
    setMcq(null);
    setTimeLeft(questionTimeLimit);
    setHistory([]);
  };

const generatePDF = () => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title (centered)
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("JavaScript MCQ Exam Report", pageWidth / 2, 20, { align: "center" });

  // Basic Info
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, 37, { align: "center" });
  doc.text(`Time: ${new Date().toLocaleTimeString()}`, pageWidth / 2, 44, { align: "center" });

 // Summary
doc.setFont("helvetica", "normal");
doc.setFontSize(12);
doc.setTextColor(0, 0, 0);
doc.text(`Total Questions: ${maxQuestions}`, pageWidth / 2, 54, { align: "center" });
doc.text(`Score: ${score} / ${maxQuestions}`, pageWidth / 2, 61, { align: "center" });

// Highlighted performance (split into label + colored value)
const performanceLabel = "Performance:";
const performanceText =
  score >= 8 ? "Excellent work!" : score >= 5 ? "Good effort!" : "Needs improvement.";
const labelWidth = doc.getTextWidth(performanceLabel);
const valueWidth = doc.getTextWidth(performanceText);
const totalWidth = labelWidth + 4 + valueWidth;
const startX = (pageWidth - totalWidth) / 2;

// Draw label in black
doc.setTextColor(0, 0, 0);
doc.text(performanceLabel, startX, 68);

// Draw result in color
if (score >= 8) doc.setTextColor(0, 128, 0); // green
else if (score >= 5) doc.setTextColor(255, 165, 0); // orange
else doc.setTextColor(200, 0, 0); // red

doc.text(performanceText, startX + labelWidth + 4, 68);

  // Question Summary Header
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text("Question Summary:", 20, 80);

  let y = 88;

  history.forEach((q, i) => {
    // Question in blue + bold
    doc.setTextColor(0, 0, 180);
    doc.setFont("helvetica", "bold");
    doc.text(`${i + 1}. ${q.question}`, 20, y);
    y += 6;

    // Reset to normal for answers
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(`Your Answer: ${q.selected}`, 25, y);
    y += 6;
    doc.text(`Correct Answer: ${q.correct}`, 25, y);
    y += 6;

    // ✅/❌ + Color for result
    if (q.result === "Correct") {
      doc.setTextColor(0, 128, 0); // Green
      doc.text(" Result: Correct", 25, y);
    } else {
      doc.setTextColor(200, 0, 0); // Red
      doc.text(" Result: " + q.result, 25, y);
    }
    y += 10;

    // Page break if needed
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  // Footer
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text("Generated by MCQ Exam App - Raj Haldar", 20, 285);

  // Save the PDF
  doc.save("MCQ_Exam_Result.pdf");
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white px-4 py-12">
      <motion.div
        initial={{ opacity: 0, translateY: 30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl p-6 rounded-3xl shadow-2xl bg-white/5 border border-gray-700 backdrop-blur"
      >
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="text-blue-400 animate-pulse" size={28} />
          <h1 className="text-2xl font-bold">🧠 JavaScript MCQ Exam</h1>
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-300">Ready to test your JavaScript skills?</p>
            <button
              onClick={startExam}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold"
            >
              🎯 Start Exam
            </button>
          </div>
        )}

        {step === 2 && mcq && (
          <>
            <div className="text-sm text-yellow-400 mb-2">⏳ Time Left: {timeLeft}s</div>

            <div className="mb-4">
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <FileText size={18} />
                <span className="text-sm">Question {questionCount + 1} of {maxQuestions}</span>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 text-sm">
                {loading ? "Loading..." : mcq.question}
              </div>
            </div>

            <div className="mb-4 space-y-2">
              {mcq.options.map((option, idx) => (
                <label key={idx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="option"
                    value={option}
                    checked={selectedOption === option}
                    onChange={() => setSelectedOption(option)}
                    className="accent-blue-500"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>

            {feedback && (
              <div className={`text-sm font-semibold mb-4 ${
                feedback.includes("✅") ? "text-green-400" : "text-red-400"
              }`}>
                {feedback}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={!selectedOption || feedback}
                className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-md text-white font-semibold disabled:opacity-50"
              >
                Submit Answer
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="text-center">
              <Bot className="mx-auto mb-3 text-yellow-400" size={36} />
              <h2 className="text-xl font-bold mb-2">🎉 Exam Completed!</h2>
              <p className="text-lg font-semibold">Your Score: {score} / {maxQuestions}</p>
              <p className="text-sm text-gray-400 mt-1">
                {score >= 8 ? "Excellent work!" : score >= 5 ? "Good effort!" : "Needs improvement."}
              </p>
            </div>

            <div className="flex justify-center mt-6 gap-4">
              <button
                onClick={restart}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-semibold"
              >
                🔁 Restart
              </button>
              <button
                onClick={generatePDF}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md font-semibold"
              >
                📄 Download PDF
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default StudentMCQExam;
