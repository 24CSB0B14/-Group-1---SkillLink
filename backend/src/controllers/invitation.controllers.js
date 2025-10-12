import { Invitation } from "../models/invitation.models.js";
import { Contract } from "../models/contract.models.js";
import { Job } from "../models/job.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

//SEND INVITATION (Client)
const sendInvitation = asyncHandler(async (req, res) => {
    const {jobId, freelancerId} = req.body
    const clientId = req.user._id

    const job = await Job.findById(jobId)
    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    if (job.type !== "DIRECT") {
        throw new ApiError(400, "Invitations allowed only for DIRECT jobs");
    }

    if (job.client.toString() !== clientId.toString()) {
        throw new ApiError(403, "You are not the owner of this job");
    }

    try {
        const invitation = await Invitation.create({
            job: jobId,
            client: clientId,
            freelancer: freelancerId
        });
        
        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    invitation,
                    "Invitation sent successfully"
                )
            );
    } 
    catch (error) {
        if (error.code === 11000) {
            throw new ApiError(400, "Freelancer already invited for this job");
        }

        throw new ApiError(500, "Error sending invitation", error);
    }
})

//RESPOND TO INVITATION (Freelancer)
const respondToInvitation = asyncHandler(async (req, res) => {
    const { invitationId, action } = req.body; // "accept" or "reject"
    const freelancerId = req.user._id;

    const invitation = await Invitation.findById(invitationId)
    .populate({
            path: "job",
            select: "_id title description budget deadline"
        })
        .populate({
            path: "client",
            select: "_id username role" // exclude email, password, etc.
        })
        .populate({
            path: "freelancer",
            select: "_id username role skills hourlyRate" // safe fields only
        });

    if (!invitation) {
        throw new ApiError(404, "Invitation not found");
    }

    if (invitation.freelancer._id.toString() !== freelancerId.toString()) {
        throw new ApiError(403, "Not authorized to respond to this invitation");
    }

    if (invitation.status !== "pending") {
        throw new ApiError(400, "Invitation already responded to");
    }

    invitation.status = action === "accept" ? "accepted" : "rejected";
    await invitation.save();

    let contract = null;

    if (action === "accept") {
        const job = invitation.job;
        const client = invitation.client;
        const freelancer = invitation.freelancer;

        // Ensure job and budget exist
        if (!job || !job.budget || job.budget <= 0) {
            throw new ApiError(400, "Invalid or missing job budget");
        }

        // Check existing contract
        const existingContract = await Contract.findOne({ job: job._id });
        if (existingContract) {
            throw new ApiError(400, "A contract already exists for this job");
        }

        const rate = Number(job.budget);
        const half = rate / 2;

        contract = await Contract.create({
            job: job._id,
            client: client._id,
            freelancer: freelancer._id,
            agreedRate: rate,
            paymentType: "milestone",
            paymentRules: [
                { milestoneName: "Initial Phase", amount: half },
                { milestoneName: "Final Delivery", amount: half }
            ],
            deliverables: [job.description || "See job details"],
            terms: "Freelancer agrees to deliver within 2 weeks.",
        });
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            { invitation, contract },
            action === "accept"
                ? "Invitation accepted and contract created successfully"
                : "Invitation rejected successfully"
        )
    );
});


export { sendInvitation, respondToInvitation }