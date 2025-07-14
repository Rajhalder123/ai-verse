import React, { useState } from "react";
import TextSummarizer from "../tools/TextSummarizer";
import ChatBot from "../tools/ChatBot";
import CodeExplainer from "../tools/CodeExplainer";
import StudentMCQExam from "../tools/StudentMCQExam"; // ✅

const tabs = [
  { id: "summarizer", label: "Text Summarizer" },
  { id: "chatbot", label: "ChatBot" },
  { id: "code", label: "Code Explainer" },
  { id: "mcq", label: "🧠 JS MCQ Exam" }, // ✅
];

const ToolSwitcher = () => {
  const [activeTab, setActiveTab] = useState("summarizer");

  const renderTool = () => {
    switch (activeTab) {
      case "summarizer":
        return <TextSummarizer />;
      case "chatbot":
        return <ChatBot />;
      case "code":
        return <CodeExplainer />;
      case "mcq":
        return <StudentMCQExam />;
      default:
        return <TextSummarizer />;
    }
  };

  return (
    <div>
      <div className="flex justify-center gap-4 flex-wrap mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 dark:text-white"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        {renderTool()}
      </div>
    </div>
  );
};

export default ToolSwitcher;
