
**💡 URL SHORTNER**
                                               
A simple and efficient URL shortener built with Node.js, Express, MongoDB, and React. This project allows users to shorten URLs and track the number of times they have been visited.

**🚀 Tech Stack**

* Backend (Node.js + Express)
* Node.js – A lightweight and efficient runtime for building fast server-side applications.
* Express.js – A minimalist framework for handling API requests, routing, and middleware.
* MongoDB (NoSQL Database) – Stores URLs, their short IDs, and click tracking data.
* Mongoose (ODM for MongoDB) – Provides schema validation and simplifies database interactions.

**Frontend (React + Bootstrap)**

* React.js – A component-based library for building dynamic user interfaces.
* Axios – Handles API requests to the backend.
* Bootstrap – Provides a clean, responsive UI with minimal effort.

**Cloud Provider**

* MongoDB Atlas (Optional) – A cloud-based MongoDB service for managing databases at scale


**🌐 Data Flow in the URL Shortener System**

Step 1: User Input (Frontend)
The user enters a long URL and clicks the "Shorten" button.
React captures the input and makes a POST request to the backend API.

Step 2: API Request (Frontend → Backend)
Frontend Request (React → Express Backend):


```ruby
axios.post("http://localhost:8001/url", { url: "https://example.com" });
```
* This request sends the original URL to the backend for processing.

Step 3: Generate Short URL (Backend)
The backend:

1. Generates a unique short ID using nanoid().
2. Saves the original URL and short ID in MongoDB.
3. Returns the shortened URL ID to the frontend.

```ruby
   { "id": "abc123" }
```
The frontend then constructs the short URL:

```ruby
http://localhost:8001/abc123
```

User Clicks on the Shortened URL (Redirection & Tracking)

Step 4: User Visits Short URL
The user clicks the shortened link:
```ruby
http://localhost:8001/abc123
```
This sends a GET request to the backend.

Step 5: Backend Looks Up URL (Database Query)
The backend searches for abc123 in MongoDB.

If found, it:

* Logs the visit by adding a timestamp to visitHistory.
* Redirects the user to the original URL.
* MongoDB Visit Tracking Update Example:

```ruby
  {
  "shortId": "abc123",
  "redirectURL": "https://example.com",
  "visitHistory": [
    { "timestamp": "2024-03-20T12:00:00Z" },
    { "timestamp": "2024-03-20T12:15:30Z" }
  ]
}
```

User Views Click Analytics
Step 7: User Requests Analytics
The frontend fetches analytics by calling:

```ruby
axios.get("http://localhost:8001/url/analytics/abc123");
```

The backend responds with the total clicks and visit history.
Step 8: Frontend Displays Data
React updates the UI to show: 

✅ Total Clicks <br/>
✅ Timestamps of visits

```ruby
{
  "totalClicks": 5,
  "visitHistory": [
    { "timestamp": "2024-03-20T12:00:00Z" },
    { "timestamp": "2024-03-20T12:15:30Z" }
  ]
}
```

**🚀 Optimization Strategies**
**Performance**
* MongoDB Indexing → Index shortId for fast lookups.
* Redis Caching → Store URL mappings to reduce DB queries.
* Async Processing → Use Promise.all() to handle multiple requests efficiently.

**Scalability**
* Load Balancing → Deploy multiple Node.js instances with NGINX.
* Microservices → Separate services for URL shortening, redirection, and analytics.
* Queue System → Use RabbitMQ/Kafka for async analytics logging.

**Error Handling**
* Centralized Error Middleware → Catch & log errors globally.
* Input Validation → Prevent invalid URLs & injections.
* Fallbacks → Handle DB failures with retries & timeouts.

**📌 How to Run Locally**

🔹 Prerequisites

* Install Node.js (LTS version)
* Install MongoDB (local or use MongoDB Atlas)

  
🔹 Setup Instructions

1️⃣ Clone the repository
```ruby
git clone https://github.com/your-username/url-shortener.git
cd url-shortener
```
2️⃣ Install Backend Dependencies
```ruby
npm install
```

3️⃣ Start MongoDB (if running locally)
```ruby
mongod
```

4️⃣ Run the Backend Server
```ruby
nodemon index.js
```

5️⃣ Install Frontend Dependencies
```ruby
cd frontend
npm install
```

6️⃣ Start the Frontend
```ruby
npm run dev
```
Key Code Snippets for URL Shortener
Here are some critical parts of the URL Shortener implementation, showcasing shortening URLs, redirection, analytics tracking, caching with Redis, and error handling.

🚀 Key Code Snippets

1️⃣ **Shorten a URL (Express + MongoDB)**
```ruby
router.post("/", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  const shortId = nanoid(6);
  const newUrl = await URL.create({ shortId, redirectURL: url });

  res.json({ shortURL: `http://localhost:8001/${shortId}` });
});
```
2️⃣ **Redirect & Track Clicks (Express + MongoDB)**
```ruby
router.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;
  const cachedUrl = await redis.get(shortId);
  if (cachedUrl) return res.redirect(JSON.parse(cachedUrl).redirectURL);

  const entry = await URL.findOneAndUpdate(
    { shortId }, { $push: { visitHistory: { timestamp: Date.now() } } }, { new: true }
  );

  if (!entry) return res.status(404).json({ error: "URL not found" });

  await redis.setex(shortId, 3600, JSON.stringify(entry));
  res.redirect(entry.redirectURL);
});
```
3️⃣ **Fetch Click Analytics**
```ruby
router.get("/analytics/:shortId", async (req, res) => {
  const entry = await URL.findOne({ shortId: req.params.shortId });
  if (!entry) return res.status(404).json({ error: "URL not found" });

  res.json({ totalClicks: entry.visitHistory.length, visitHistory: entry.visitHistory });
});
```
**💻 Geolocation & Link Traffic Heatmap** <br/>
To be Developed




