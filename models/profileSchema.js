const mongoose = require("mongoose")

const profileSchema = new mongoose.Schema({
    userId: { type: String, require: true, unique: true },
    serverId: { type: String, require: true },
    balance: { type: Number, default: 100 },
    dailyLastUsed: { type: Number, default: 0 },
    coinflipLastUsed: {type: Number, default: 0},
});

const model = mongoose.model("gambledb", profileSchema);

module.exports = model;