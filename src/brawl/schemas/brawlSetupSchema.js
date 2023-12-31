const mongoose = require("mongoose");
const imageSchema = require("./cardImageSchema");

// Define a schema for storing brawl setups
const setupSchema = new mongoose.Schema({
    name: String,
    theme: String,
    series: {
        type: String,
        default: null,
    },
    sketch: String,
    messageID: String,
    unixStartTime: String,
    entries: {
        type: Map,
        of: [String],
        default: new Map(),
    },
    cards: {
        type: Map,
        of: imageSchema,
        default: new Map(),
    },
    open: {
        type: Boolean,
        default: true,
    },
});

const BrawlSetupModel = mongoose.model("brawl setup", setupSchema);

module.exports = BrawlSetupModel;
