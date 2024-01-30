const EnergieMeting = require("../models/energie_meting.js");

class EnergieController {
  async saveEnergieMeting(req, res) {
    try {
      let data = req.body;

      const energieMeting = new EnergieMeting(data);
      await energieMeting.save();

      res.status(201).json({ message: "Data saved successfully" });
    } catch (error) {
      console.error("Error saving data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getLastEnergieMeting(req, res) {
    try {
      const lastEnergieMeting = await EnergieMeting.findOne().sort({
        timeStamp: -1,
      });

      if (!lastEnergieMeting) {
        return res.status(404).json({ message: "No data found" });
      }

      res.json(lastEnergieMeting);
    } catch (error) {
      console.error("Error fetching last data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new EnergieController();
