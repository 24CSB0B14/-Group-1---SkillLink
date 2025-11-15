import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    }
},
{
    timestamps: true
})

invitationSchema.index({job: 1, freelancer: 1}, {unique: true}) //prevent duplicates

export const Invitation = mongoose.model("Invitation", invitationSchema)