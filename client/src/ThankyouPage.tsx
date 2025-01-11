import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import urlConfig from './config/url-config';

export const ThankyouPage = () => {
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState(false)
  const [summary, setSummary] = useState("This is where the meeting summary will be displayed.")

  const apiBaseUrl = urlConfig.apiBaseUrl
  
  const location = useLocation();

  // Create a URLSearchParams object to easily get the query parameter
  const queryParams = new URLSearchParams(location.search);

  // Fetch the room_id from the URL
  const roomId = queryParams.get('room_id');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/session/${roomId}/summary`)
        const data = await response.json()
        setStatus(data.status)
        if (data.status == 'active') {
          setTimeout(fetchStatus, 10000)
        } else {
          setLoading(false)
          setSummary(data.summary)
        }
      } catch (error) {
        console.error("Error fetching status:", error)
        setLoading(false)
      }
    }

    fetchStatus()
  }, [])


  return (
    <div className="container">
      {loading || !status ? (
        <div className="loader-container">
          <div className="loader">
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
          <h2 className="loading-text">{loading ? "Loading..." : "Waiting for status..."}</h2>
          <p className="loading-subtext">Please wait while we prepare your summary</p>
        </div>
      ) : (
        <div className="content">
          <h1 className="title">Thank You</h1>
          <p className="message">We appreciate your participation in the meeting.</p>
          <div className="summary-container">
            <h2 className="summary-title">Meeting Summary</h2>
            <div className="summary-scroll">
              <p className="summary-text">{summary}</p>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #121212;
          color: #ffffff;
          font-family: Arial, sans-serif;
          overflow: hidden;
        }

        .loader-container, .content {
          text-align: center;
          max-width: 70%;
          padding: 2rem;
        }

        .loader {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 2rem;
        }

        .circle {
          width: 20px;
          height: 20px;
          background-color: #ffffff;
          border-radius: 50%;
          margin: 0 10px;
          animation: bounce 0.5s ease-in-out infinite;
        }

        .circle:nth-child(2) {
          animation-delay: 0.1s;
        }

        .circle:nth-child(3) {
          animation-delay: 0.2s;
        }

        .loading-text {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: #ffffff;
        }

        .loading-subtext {
          font-size: 1rem;
          color: #b3b3b3;
        }

        .title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #ffffff;
        }

        .message {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          color: #e0e0e0;
        }

        .summary-container {
          background-color: #1e1e1e;
          border-radius: 8px;
          padding: 1.5rem;
          text-align: left;
          max-height: 60vh;
          display: flex;
          flex-direction: column;
        }

        .summary-title {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #b3b3b3;
        }

        .summary-scroll {
          overflow-y: auto;
          flex-grow: 1;
          padding-left: 10px;
        }

        .summary-text {
          font-size: 1rem;
          line-height: 1.6;
          white-space: pre-wrap;
          word-wrap: break-word;
          color: #e0e0e0;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .content {
          animation: fadeIn 1s ease-in;
        }

        @media (max-width: 600px) {
          .title {
            font-size: 2rem;
          }

          .message {
            font-size: 1rem;
          }

          .summary-title {
            font-size: 1.2rem;
          }

          .summary-text {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  )
}
