const express = require("express");
const os = require("os");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/info", (req, res) => {
  res.json({
    app: "Kubernetes Ingress Demo",
    hostname: os.hostname(),
    nodeVersion: process.version,
    platform: os.platform(),
    time: new Date().toLocaleString(),
    env: process.env.NODE_ENV || "production"
  });
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
