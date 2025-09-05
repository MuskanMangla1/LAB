import React from "react";

function Navbar({ currentTab, setCurrentTab }) {
  const tabs = [
    { id: "add", label: "➕ Add Patient" },
    { id: "reports", label: "📊 Reports" },
    { id: "list", label: "📋 Today’s Patients" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex gap-4 p-4 justify-center md:justify-start">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setCurrentTab(t.id)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              currentTab === t.id
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
