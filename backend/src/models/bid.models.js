import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    coverLetter: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    },
},
{
    timestamps: true
});

//Prevent duplicate bids per freelancer per job
bidSchema.index({job: 1, freelancer: 1}, {unique: true}); 

export const Bid = mongoose.model("Bid", bidSchema)