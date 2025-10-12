import mongoose from "mongoose";

const freelancerProfileSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true 
    },
    skills: [{ type: String }],
    portfolio: { 
        type: String 
    },
    hourlyRate: { 
        type: Number, 
        default: 0
    },
    experience: { 
        type: String,
    }
},
{
    timestamps: true
})

export const FreelancerProfile = mongoose.model("FreelancerProfile", freelancerProfileSchema);