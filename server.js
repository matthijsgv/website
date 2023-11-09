const express = require("express");
const app = express();
const path = require("path");

// Serve React app
app.use(express.static(path.join(__dirname, "website", "build")));

app.get("/alibouali", (req, res) => {
  res.json({ message: "This is a test API endpoint for /alibouali" });
});

// Handle other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "website", "build", "index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
