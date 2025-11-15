import mongoose from "mongoose";

const paymentRuleSchema = new mongoose.Schema({
    milestoneName: String,
    amount: Number,
    dueDate: Date,
    status: {
        type: String,
        enum: ["pending", "released", "refunded"],
        default: "pending"
    }
}, { _id: false });

const contractSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        freelancer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        agreedRate: {
            type: Number,
            required: true,
        },
        paymentType: {
            type: String,
            enum: ["fixed", "hourly", "milestone"],
            default: "fixed"
        },
        paymentRules: [paymentRuleSchema], // milestone-based or flexible payment structure

        status: {
            type: String,
            enum: ["active", "completed", "cancelled", "disputed"],
            default: "active",
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: Date,

        terms: {
            type: String,
            default: "Standard platform terms apply unless otherwise specified."
        },

        revisionPolicy: {
            type: String,
            default: "Freelancer will provide up to 2 revisions before delivery acceptance."
        },

        terminationClause: {
            type: String,
            default: "Either party may terminate the contract with written notice if the other party breaches agreed terms."
        },

        disputeResolution: {
            type: String,
            default: "All disputes shall be handled via platform mediation or arbitration."
        },

        deliverables: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

export const Contract = mongoose.model("Contract", contractSchema) 