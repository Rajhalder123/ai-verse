import React, { useEffect, useState } from "react";
import { FaRobot } from "react-icons/fa";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
    setDarkMode(!darkMode);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="z-50 sticky top-0 backdrop-blur-lg bg-white/30 dark:bg-black/30 shadow-xl px-6 py-4 rounded-b-xl 
                 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center"
    >
      {/* Left Branding */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center gap-3 text-2xl font-extrabold text-gray-800 dark:text-white"
      >
        <FaRobot className="text-purple-600 dark:text-blue-400" />
        <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
          AiVerse
        </span>
      </motion.div>

      {/* Right Controls */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="px-5 py-2 flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 
                   dark:from-blue-500 dark:to-purple-700 text-white font-semibold rounded-full shadow-lg
                   hover:scale-105 transition-transform duration-200"
      >
        <Sparkles size={18} />
        {darkMode ? "Light Mode" : "Dark Mode"}
      </motion.button>
    </motion.nav>
  );
};

export default Navbar;
