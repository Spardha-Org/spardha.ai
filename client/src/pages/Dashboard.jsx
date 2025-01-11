import { useState } from "react";
import { Sidebar } from "../components/DashboardComps/Sidebar";
import { MainContent } from "../components/DashboardComps/MainContent";

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);



  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}

      {/* Main Content */}
      <div
        className={`flex-grow h-screen overflow-y-auto transition-all duration-300 ease-in-out ${
          collapsed ? "ml-10" : "ml-10"
        }`}
      >
        <MainContent />
      </div>
    </div>
  );
}
