const http = require("http");
const fs = require("fs");
const logger = require("../Logging Middleware/logger");
const db = require("./database");

const generateShortcode = () => Math.random().toString(36).substring(2, 8);
const getExpiryDate = (min) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + (min || 30));
  return date.toISOString();
};

const server = http.createServer((req, res) => {
  logger(req, res, () => {
    if (req.method === "POST" && req.url === "/shorturls") {
      let body = "";
      req.on("data", chunk => body += chunk);
      req.on("end", () => {
        try {
          const { url, validity, shortcode } = JSON.parse(body);

          if (!/^https?:\/\//.test(url)) throw { status: 400, msg: "Invalid URL" };
          const code = shortcode || getUniqueCode();
          if (shortcode && db.urls[shortcode]) throw { status: 409, msg: "Shortcode exists" };

          const expiry = getExpiryDate(validity);
          db.urls[code] = {
            url,
            createdAt: new Date().toISOString(),
            expiry,
            clicks: 0,
            logs: [],
          };

          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify({
            shortLink: `http://localhost:3000/${code}`,
            expiry
          }));

        } catch (e) {
          res.writeHead(e.status || 500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: e.msg || "Something went wrong" }));
        }
      });

    } else if (req.method === "GET" && req.url.startsWith("/shorturls/")) {
      const code = req.url.split("/")[2];
      const record = db.urls[code];

      if (!record) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Shortcode not found" }));
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        originalUrl: record.url,
        createdAt: record.createdAt,
        expiry: record.expiry,
        totalClicks: record.clicks,
        clickDetails: record.logs
      }));

    } else if (req.method === "GET" && /^\/\w{6}$/.test(req.url)) {
      const code = req.url.slice(1);
      const record = db.urls[code];

      if (!record) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Shortcode not found" }));
        return;
      }

      if (new Date() > new Date(record.expiry)) {
        res.writeHead(410, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Short URL expired" }));
        return;
      }

      record.clicks++;
      record.logs.push({
        timestamp: new Date().toISOString(),
        referrer: req.headers.referer || "unknown",
        userAgent: req.headers["user-agent"],
        ip: req.socket.remoteAddress,
      });

      res.writeHead(302, { Location: record.url });
      res.end();

    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid endpoint" }));
    }
  });
});

function getUniqueCode() {
  let code;
  do {
    code = generateShortcode();
  } while (db.urls[code]);
  return code;
}

server.listen(3000, () => {
  console.log("Running at http://localhost:3000");
});
