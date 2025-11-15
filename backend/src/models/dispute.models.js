import mongoose from "mongoose";

const disputeSchema = new mongoose.Schema({
  escrow: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Escrow",
    required: true
  },
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "in-review", "resolved", "escalated"],
    default: "pending"
  },
  decision: {
    type: String,
    enum: ["client", "freelancer", "split", "continue"]
  },
  resolutionNotes: String,
  resolvedAt: Date,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  evidence: [{
    type: {
      type: String,
      enum: ["file", "message", "screenshot"]
    },
    url: String,
    description: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { 
  timestamps: true 
});

export const Dispute = mongoose.model("Dispute", disputeSchema);