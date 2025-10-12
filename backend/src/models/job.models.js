import mongoose from "mongoose";
import { Schema } from "mongoose";
import { CONTRACT_STATUS } from "../utils/constants.js";

const jobSchema = new Schema({
    title: {
        type: String,
        required: [true, "Job title is required"],
        trim: true,
        minlength: [5, "Title must be at least 5 characters long"],
    },
    description: {
        type: String,
        required: [true, "Job description is required"],
        minlength: [20, "Description must be at least 20 characters long"],
    },
    budget: {
        type: Number,
        required: [true, "Budget is required"],
        min: [10, "Budget must be at least 10"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["OPEN", "DIRECT"], // OPEN → bid system, DIRECT → direct hire
      required: true,
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    assignedFreelancer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    bids: [
        {
            type: Schema.Types.ObjectId,
            ref: "Bid",
        },
    ],
    status: {
        type: String,
        enum: [CONTRACT_STATUS.ACTIVE, CONTRACT_STATUS.IN_PROGRESS, CONTRACT_STATUS.CANCELLED, CONTRACT_STATUS.COMPLETED, CONTRACT_STATUS.DISPUTED],
        default: CONTRACT_STATUS.ACTIVE,
    },
},
{
    timestamps: true,
});

export const Job = mongoose.model("Job", jobSchema)