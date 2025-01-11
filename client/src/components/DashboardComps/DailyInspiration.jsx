import React, { useState, useEffect } from "react";
import axios from "axios";
import urlConfig from "../../config/url-config";

const apibaseurl = urlConfig.apiBaseUrl;

console.log(apibaseurl);

export function DailyInspiration() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    // Fetch the random quote from the Django API
    const fetchQuote = async () => {
      try {
        const response = await axios.get(`${apibaseurl}/api/daily-quote/`);
        const data = response.data; // The API response JSON object

        setQuote(data.quote); // Set the quote text
        setAuthor(data.author); // Set the author's name
      } catch (error) {
        console.error("Error fetching the quote:", error);
        setQuote("Happiness is just an state of mind .....!");
        setAuthor("you..!");
      }
    };

    fetchQuote();
  }, []); // Runs once when the component mounts

  return (
    <div
      className="min-h-[480px] rounded-lg p-6 flex flex-col justify-end bg-cover bg-center mb-6"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), 
          url("https://cdn.usegalileo.ai/sdxl10/95dba8b0-216c-4a25-8118-f46c9b1820db.png")
        `,
      }}
    >
      <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-black text-center mb-4">
        {quote || "Loading inspirational quote..."}
      </h3>
      {author && (
        <p className="text-white text-lg text-center italic">- {author}</p>
      )}
    </div>
  );
}
