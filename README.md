# 🌐 URL Shortener Microservice

**Name**: Rashi Gupta  
**Roll Number**: 2200970100132  

---

## 📌 Overview

This project is a lightweight Node.js microservice that allows users to create shortened URLs, track usage statistics, and define custom expiry durations. It is built using native modules only, without any external frameworks.

---

## 🛠️ Tech Stack & Design Choices

| Area         | Choice             | Reason |
|--------------|--------------------|--------|
| Language     | Node.js (Vanilla)  | Fast, lightweight, and easy to set up for a microservice |
| HTTP Server  | Native `http` module | Avoids extra dependencies like Express for simplicity |
| Storage      | In-memory object (`db.js`) | Fits short-term test context; fast access |
| Logging      | Custom middleware (`logger.js`) | Required by the test; avoids `console.log` |
| Data Format  | JSON                | Standardized for REST APIs |
| Deployment   | Localhost (Port 3000) | Testable via Postman, no auth required |

---

## 🧱 Architecture Overview

2200970100132/
├── Logging Middleware/
│ └── logger.js ← Custom middleware to log requests
│
├── Backend Test Submission/
│ ├── server.js ← Main entry, request router
│ ├── database.js ← In-memory data store
│ └── postman-screenshots/ (optional)

yaml
Copy code

All logic is handled in a single-layered structure for simplicity. No external router or controller framework used.

---

## 💾 Data Model (In-Memory)

Each short URL entry looks like this:

```js
{
  "abc123": {
    url: "https://example.com",
    createdAt: "2025-06-27T...",
    expiry: "2025-06-27T...",
    clicks: 1,
    logs: [
      {
        timestamp: "...",
        referrer: "...",
        userAgent: "...",
        ip: "..."
      }
    ]
  }
}
🚀 Features
Create short URLs (with optional custom code)

Default 30 min expiry (configurable by input)

Redirection support

Tracks total clicks + metadata (IP, time, referrer)

Returns structured error messages

Robust input validation and status codes

🧪 Testing Instructions
Run:

bash
Copy code
cd "Backend Test Submission"
node server.js
Test with Postman:

POST /shorturls → create new short URL

GET /:shortcode → redirect to original URL

GET /shorturls/:shortcode → view usage stats

Sample screenshots included in postman-screenshots/ (optional)

🧠 Assumptions
No authentication required

All requests are pre-authorized

In-memory store is acceptable for this test

Shortcode is 6 characters if auto-generated

✅ Evaluation Checklist
 Functional microservice with all endpoints

 In-memory URL storage and tracking

 Custom logging middleware

 Unique shortcodes with expiry

 Clear documentation with design reasoning