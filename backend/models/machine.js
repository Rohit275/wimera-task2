const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  signal: { type: String, required: true },
  angSignal: { type: String, required: true },
  modbus: { type: Number, required: true },
});

module.exports = mongoose.model("Machine", machineSchema);
