import React, { useRef } from "react";

export function CurrentAffairs() {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4">Daily Current Affairs</h2>

      {/* Scroll Buttons */}
      <div className="relative">
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow rounded-full p-2"
          onClick={scrollLeft}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow rounded-full p-2"
          onClick={scrollRight}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 scrollbar-hide"
        >
          {/* Content Items */}
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="min-w-[300px] flex-shrink-0 bg-white rounded-lg shadow p-4"
            >
              <h3 className="text-lg font-bold mb-2">
                International Relations
              </h3>
              <p className="text-sm text-gray-500">
                China's foreign minister meets Taliban in China
              </p>
              <button className="mt-3 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                Read more
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
