const mongoose = require("mongoose");

const energieSchema = new mongoose.Schema({
  timeStamp: {
    type: Date,
    default: Date.now,
  },
  consumptieLaagTarief: { type: Number },
  consumptieHoogTarief: { type: Number },
  retourleveringLaagTarief: { type: Number },
  retourleveringHoogTarief: { type: Number },
  werkelijkVerbruik: { type: Number },
  werkelijkeRetourlevering: { type: Number },
  l1InstantVermogensgebruik: { type: Number },
  l2InstantVermogensgebruik: { type: Number },
  l3InstantVermogensgebruik: { type: Number },
  l1InstantStroomgebruik: { type: Number },
  l2InstantStroomgebruik: { type: Number },
  l3InstantStroomgebruik: { type: Number },
  werkelijkeTariefGroep: { type: Number },
  korteStroomStoringen: { type: Number },
  langeStroomstoringen: { type: Number },
  korteStroomOnderbrekingen: { type: Number },
  korteStroomPieken: { type: Number },
});

const EnergieMeting = mongoose.model("EnergieMeting", energieSchema);

module.exports = EnergieMeting;
