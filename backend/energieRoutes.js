const express = require("express");
const energieController = require("./controller/energieController");
const router = express.Router();

router.post("/energie-meting", energieController.saveEnergieMeting);
router.get("/last-energie-meting", energieController.getLastEnergieMeting);

module.exports = router;
