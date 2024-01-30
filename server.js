const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const energieRoutes = require("./backend/energieRoutes");
const bodyParser = require("body-parser");

app.use(bodyParser.json());

const connectionString =
  "mongodb+srv://matthijs:sTC6UytAkEUM7g0x@energie.7nbx6vz.mongodb.net/?retryWrites=true&w=majority";

// Connect to MongoDB using Mongoose
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Serve React app
app.use(express.static(path.join(__dirname, "website", "build")));

app.use("/", energieRoutes);

// app.post("/energie-meting", async (req, res) => {
//   try {
//     let data = req.body; // Assuming the data is sent in the request body
//     data.timestamp = new Date().toLocaleString();
//     console.log(data);
//     // Create a new instance of the EnergieMeting model
//     const energieMeting = new EnergieMeting(data);
//     console.log("Energie meting", energieMeting);
//     // Save the data to MongoDB
//     await energieMeting.save();

//     res.status(201).json({ message: "Data saved successfully" });
//   } catch (error) {
//     console.error("Error saving data:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// Handle other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "website", "build", "index.html"));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
