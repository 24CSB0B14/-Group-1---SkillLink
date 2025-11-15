import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    contract: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contract",
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reviewee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 1000
    },
    categories: {
        communication: { type: Number, min: 1, max: 5 },
        quality: { type: Number, min: 1, max: 5 },
        professionalism: { type: Number, min: 1, max: 5 },
        deadlines: { type: Number, min: 1, max: 5 }
    },
    isPublic: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Prevent duplicate reviews for the same contract
reviewSchema.index({ contract: 1, reviewer: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);
