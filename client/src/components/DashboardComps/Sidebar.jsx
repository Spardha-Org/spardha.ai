import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaClipboardList,
  FaQuestionCircle,
  FaRobot,
  FaChartBar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

// Menu items and their corresponding routes and icons
const menuItems = [
  { name: "Home", icon: FaHome, route: "/" },
  { name: "Courses", icon: FaBook, route: "/courses" },
  { name: "Test Series", icon: FaClipboardList, route: "/test-series" },
  { name: "Doubts", icon: FaQuestionCircle, route: "/doubts" },
  { name: "AI Mentor", icon: FaRobot, route: "/ai-mentor" },
  {
    name: "Performance Analysis",
    icon: FaChartBar,
    route: "/performance-analysis",
  },
];

export function Sidebar({ collapsed, toggleSidebar }) {
  const location = useLocation(); // Hook to get the current path
  const [activeMenu, setActiveMenu] = useState(location.pathname); // State to track active menu

  // Update the active menu when the route changes
  React.useEffect(() => {
    setActiveMenu(location.pathname);
  }, [location.pathname]);

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-80"
      } flex flex-col p-4 bg-gray-100 h-screen transition-all duration-300 ease-in-out relative`}
      style={{ overflow: "hidden" }}
    >
      {/* Toggle Arrow */}
      <button
        onClick={toggleSidebar}
        className={`absolute top-4 -right-3 p-2 rounded-full bg-white shadow-lg hover:bg-gray-200 transition-all duration-200 z-20`}
      >
        <div className={`transform transition-all duration-200`}>
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </div>
      </button>

      {/* Menu Items */}
      <div className="flex-grow mt-10">
        {menuItems.map((item, index) => (
          <Link key={item.name} to={item.route}>
            <div
              className={`flex items-center px-4 py-3 mb-2 rounded-lg cursor-pointer transition-all duration-200 ${
                activeMenu === item.route
                  ? "bg-blue-100 text-blue-600" // Highlight active item
                  : "hover:bg-gray-200"
              } ${collapsed ? "justify-center" : ""}`}
              onClick={() => setActiveMenu(item.route)} // Update active menu on click
            >
              <item.icon className={`text-xl ${collapsed ? "text-2xl" : ""}`} />
              {!collapsed && (
                <span className="text-sm font-medium ml-4">{item.name}</span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Upgrade Button */}
      <button
        className={`w-full mt-4 mb-4 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors duration-200 ${
          collapsed ? "px-2" : "px-4"
        }`}
      >
        {collapsed ? "+" : "Upgrade to Plus"}
      </button>

      {/* Progress Section */}
      <div
        className={`p-4 bg-white rounded-lg shadow ${
          collapsed ? "text-center" : ""
        }`}
      >
        {!collapsed && (
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-800">
              UPSC CSE 2023
            </span>
            <span className="text-sm text-gray-600">2/10</span>
          </div>
        )}
        <div className="relative w-full h-2 bg-gray-300 rounded-full">
          <div
            className="absolute top-0 left-0 h-2 bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: "20%" }}
          ></div>
        </div>
        {!collapsed && (
          <span className="block mt-2 text-sm text-gray-500">20% complete</span>
        )}
      </div>
    </div>
  );
}
