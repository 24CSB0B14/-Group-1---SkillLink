import mongoose from "mongoose";
import { Schema } from "mongoose";
import { CONTRACT_STATUS } from "../utils/constants.js";
import { Bid } from "./bid.models.js";
import { Notification } from "./notification.models.js";

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
    // Additional fields
    skills: [{
        type: String,
        trim: true
    }],
    experienceLevel: {
        type: String,
        enum: ["entry", "intermediate", "expert"],
        default: "intermediate"
    },
    deadline: {
        type: Date
    }
},
{
    timestamps: true,
});

// Add pre-validation hook to log validation errors
jobSchema.pre('validate', function(next) {
    next();
});

// Add post-validation hook to log validation results
jobSchema.post('validate', function(doc, next) {
    next();
});

// Add error handling for validation
jobSchema.post('save', function(error, doc, next) {
    if (error.name === 'ValidationError') {
        // Handle validation error silently
    }
    next(error);
});

// Pre-remove middleware to handle cascading deletions
jobSchema.pre('remove', async function(next) {
    try {
        const jobId = this._id;
        
        // Find all bids for this job
        const bids = await Bid.find({ job: jobId });
        const bidIds = bids.map(bid => bid._id);
        
        // Delete all bids associated with this job
        await Bid.deleteMany({ job: jobId });
        
        // Delete notifications related to the job and its bids
        await Notification.deleteMany({
            $or: [
                { relatedId: jobId, relatedModel: "Job" },
                { relatedId: { $in: bidIds }, relatedModel: "Bid" }
            ]
        });
        
        next();
    } catch (error) {
        next(error);
    }
});

// Pre-deleteOne middleware for findByIdAndDelete
jobSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    try {
        const jobId = this._id;
        
        // Find all bids for this job
        const bids = await Bid.find({ job: jobId });
        const bidIds = bids.map(bid => bid._id);
        
        // Delete all bids associated with this job
        await Bid.deleteMany({ job: jobId });
        
        // Delete notifications related to the job and its bids
        await Notification.deleteMany({
            $or: [
                { relatedId: jobId, relatedModel: "Job" },
                { relatedId: { $in: bidIds }, relatedModel: "Bid" }
            ]
        });
        
        next();
    } catch (error) {
        next(error);
    }
});

export const Job = mongoose.model("Job", jobSchema);