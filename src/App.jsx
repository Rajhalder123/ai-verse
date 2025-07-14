import React from "react";
import Navbar from "./components/Navbar";
import ToolSwitcher from "./components/ToolSwitcher";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <ToolSwitcher/>
      </main>
    </div>
  );
};

export default App;
