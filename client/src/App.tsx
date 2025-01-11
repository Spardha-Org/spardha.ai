import "livekit-react/dist/index.css";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { PreJoinPage } from "./PreJoinPage";
import { RoomPage } from "./RoomPage";
import { NotFoundPage } from "./NotFoundPage";
import { ThankyouPage } from "./ThankyouPage";
import DashboardPage from "./pages/Dashboard";
import { Sidebar } from "./components/DashboardComps/Sidebar";
import { useState } from "react";
import AthenaAIUPSC from "./components/AimentorComponents/AimentorPage";

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  // Toggle sidebar state
  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <Router>
      {" "}
      {/* Move Router here to wrap the entire app */}
      <div className="flex min-h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            collapsed ? "w-20" : "w-80"
          } flex-shrink-0 h-screen overflow-y-auto bg-gray-100 shadow`}
        >
          <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
        </div>

        {/* Main Content */}
        <div
          className={`flex-grow h-screen overflow-y-auto transition-all duration-300 ease-in-out ${
            collapsed ? "ml-10" : "ml-10"
          }`}
        >
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/ai-mentor" element={<AthenaAIUPSC />} />
            <Route path="/thankyou" element={<ThankyouPage />} />
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="/room" element={<RoomPage />} />
            <Route path="/prejoin" element={<PreJoinPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
