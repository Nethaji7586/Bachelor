const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: String,
  description: String,
  salary: String,
  location: String,
  phone: String,
  duration: String,

  membersNeeded: Number,
  membersApplied: { type: Number, default: 0 },

  appliedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  expiresAt: Date,
  createdAt: { type: Date, default: Date.now }
});

// TTL delete
JobSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Job", JobSchema);