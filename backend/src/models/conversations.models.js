import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
      }
    ],
    job: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Job",
      default: null
    },
    contract: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Contract",
      default: null
    },
  },
  { timestamps: true }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);