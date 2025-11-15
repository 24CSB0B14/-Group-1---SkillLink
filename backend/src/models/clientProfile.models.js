import mongoose from "mongoose";

const clientProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    companyName: {
        type: String,
        trim: true
    },
    logo: {
        type: String,
    },
    contact: {
        type: Number,
    },
    about: {
        type: String,
    },
    jobsPosted: {
        type: String,
    },
},
{
    timestamps: true
});

export const ClientProfile = mongoose.model("ClientProfile", clientProfileSchema)