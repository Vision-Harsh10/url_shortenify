import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!originalUrl.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    setLoading(true);
    setError("");
    setShortUrl("");

    try {
      const response = await axios.post(
        "http://localhost:8001/url",
        { url: originalUrl }, 
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("API Response:", response.data);
      
      if (response.data.id) {
        setShortUrl(`http://localhost:8001/${response.data.id}`); 
      } else {
        setError("Error: Invalid response from server");
      }
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      setError("Failed to shorten URL. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-sm" style={{ width: "400px" }}>
        <h3 className="text-center mb-3 text-primary">URL Shortener</h3>
        <input
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          type="text"
          className="form-control mb-3"
          placeholder="Enter URL"
          disabled={loading}
        />
        <button
          onClick={handleSubmit}
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Shortening..." : "Shorten"}
        </button>

        {error && <div className="text-danger mt-3 text-center">{error}</div>}

        {shortUrl && (
          <div className="alert alert-success mt-3 text-center">
            <strong>Shortened URL:</strong>  
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">
              {shortUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
