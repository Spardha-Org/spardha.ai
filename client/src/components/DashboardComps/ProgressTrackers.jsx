import React from "react";
import { CircularProgressbar } from "react-circular-progressbar"; // Install this library via npm
import "react-circular-progressbar/dist/styles.css"; // Import styles

export function ProgressTrackers() {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Track your progress</h2>

      {/* Progress Cards */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {["Total Points", "Streak", "Badges"].map((item, index) => (
          <div
            key={item}
            className="flex-1 bg-slate-100 p-4 rounded-lg text-center shadow-lg"
          >
            <p className="text-base font-medium">{item}</p>
            <div className="text-2xl font-bold">
              {index === 0 ? (
                <div className="w-24 h-24 mx-auto">
                  <CircularProgressbar
                    value={70} // Percentage value for example
                    text={`1,500`}
                    styles={{
                      path: { stroke: "#4caf50", strokeWidth: 8 },
                      trail: { stroke: "#e0e0e0" },
                      text: { fill: "#4caf50", fontSize: "20px" },
                    }}
                  />
                </div>
              ) : index === 1 ? (
                <div className="w-24 h-24 mx-auto">
                  <CircularProgressbar
                    value={85} // Example for streak completion
                    text={`15`}
                    styles={{
                      path: { stroke: "#ff9800", strokeWidth: 8 },
                      trail: { stroke: "#e0e0e0" },
                      text: { fill: "#ff9800", fontSize: "20px" },
                    }}
                  />
                </div>
              ) : (
                <div className="w-24 h-24 mx-auto">
                  <CircularProgressbar
                    value={50} // Example for badge completion
                    text={`7`}
                    styles={{
                      path: { stroke: "#2196f3", strokeWidth: 8 },
                      trail: { stroke: "#e0e0e0" },
                      text: { fill: "#2196f3", fontSize: "20px" },
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Linear Progress Bar */}
      <div>
        <div className="flex justify-between mb-2">
          <p className="text-base font-medium">Complete</p>
        </div>
        <div className="w-full h-2 bg-slate-300 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500" style={{ width: "70%" }}></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">70% complete</p>
      </div>
    </div>
  );
}
