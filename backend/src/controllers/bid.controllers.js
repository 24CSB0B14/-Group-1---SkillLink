import { Bid } from "../models/bid.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { UserRolesEnum } from "../utils/constants.js";
import { Job } from "../models/job.models.js";
import { Contract } from "../models/contract.models.js";

const postBid = asyncHandler(async (req, res) => {
    const { jobId, amount, coverLetter } = req.body

    if (req.user.role !== UserRolesEnum.FREELANCER) {
        throw new ApiError(403, "Only freelancers can place bids");
    }

    const job = await Job.findById(jobId);
    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    if (job.type !== "OPEN") {
        throw new ApiError(400, "Bids can only be placed on OPEN jobs");
    }

    // ✅ Create the bid
    const bid = await Bid.create({
        job: jobId,
        freelancer: req.user._id,
        amount,
        coverLetter,
    });

    res
    .status(201)
    .json(
        new ApiResponse(
            201,
            bid,
            "Bid submitted successfully"
        )
    );
})

const acceptBid = asyncHandler(async (req, res) => {
    const { bidId } = req.body
    const clientId = req.user._id

    const bid = await Bid.findById(bidId)
        .populate("job")
        .populate({
            path: "freelancer",
            select: "id, username fullname skills portfolio experience" 
        });

    if (!bid) {
        throw new ApiError(404, "Bid not found");
    }

    const job = bid.job;

    if (job.client.toString() !== clientId.toString()) {
        throw new ApiError(403, "Not authorized to accept this bid");
    }

    if (job.type !== "OPEN") {
        throw new ApiError(400, "Only OPEN-type jobs support bid acceptance");
    }

    const existingContract = await Contract.findOne({ job: job._id });
    if (existingContract) {
        throw new ApiError(400, "A contract already exists for this job");
    }

    const contract = await Contract.create({
        job: job._id,
        client: job.client,
        freelancer: bid.freelancer._id,
        agreedRate: bid.amount,
        paymentType: "milestone",
        paymentRules: [
            { milestoneName: "Initial Phase", amount: bid.amount / 2 },
            { milestoneName: "Final Delivery", amount: bid.amount / 2 }
        ],
        deliverables: job.description || [],
        terms: "Freelancer agrees to deliver within 2 weeks.",
    });

    bid.status = "accepted";
    await bid.save();

    await Bid.updateMany(
        { job: job._id, _id: { $ne: bid._id } },
        { $set: { status: "rejected" } }
    );

    return res
        .status(200)
        .json(
        new ApiResponse(
            200,
            { contract, acceptedBid: bid },
            "Bid accepted and contract created successfully"
        )
    );
})

export { postBid, acceptBid }