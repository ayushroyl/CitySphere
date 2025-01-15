import React from "react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = ["dashboard", "users", "orders", "services"];
  return (
    <div className="bg-gray-800 text-white h-full p-4">
      <ul>
        {tabs.map((tab) => (
          <li
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`p-2 rounded cursor-pointer ${
              activeTab === tab ? "bg-gray-600" : ""
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
