import { Bid } from "../models/bid.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { UserRolesEnum } from "../utils/constants.js";
import { Job } from "../models/job.models.js";
import { Contract } from "../models/contract.models.js";
import { createNotification } from "./notification.controllers.js";

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

    // Create notification for client
    await createNotification({
        recipient: job.client,
        sender: req.user._id,
        type: "bid",
        title: "New Bid Received",
        message: `${req.user.username} submitted a bid of $${amount} for your job`,
        relatedId: bid._id,
        relatedModel: "Bid",
        actionUrl: `/job-details/${jobId}`
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
});

const acceptBid = asyncHandler(async (req, res) => {
    const { bidId } = req.body
    const clientId = req.user._id

    const bid = await Bid.findById(bidId)
        .populate("job")
        .populate({
            path: "freelancer",
            select: "username fullname email" 
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
            { milestoneName: "Initial Phase", amount: bid.amount / 2, status: "pending" },
            { milestoneName: "Final Delivery", amount: bid.amount / 2, status: "pending" }
        ],
        deliverables: [job.description] || [],
        terms: "Freelancer agrees to deliver as per job requirements.",
        status: "active"
    });

    bid.status = "accepted";
    await bid.save();

    await Bid.updateMany(
        { job: job._id, _id: { $ne: bid._id } },
        { $set: { status: "rejected" } }
    );

    // Update job status and assign freelancer
    job.status = "IN_PROGRESS";
    job.assignedFreelancer = bid.freelancer._id;
    await job.save();

    // Create notification for freelancer
    await createNotification({
        recipient: bid.freelancer._id,
        sender: clientId,
        type: "contract",
        title: "Bid Accepted! Contract Created",
        message: "Your bid has been accepted! A contract has been created for the job.",
        relatedId: contract._id,
        relatedModel: "Contract",
        actionUrl: `/contract/${contract._id}`
    });

    const populatedContract = await Contract.findById(contract._id)
        .populate("client", "username email")
        .populate("freelancer", "username email")
        .populate("job", "title description budget");

    return res
        .status(200)
        .json(
        new ApiResponse(
            200,
            { contract: populatedContract, acceptedBid: bid },
            "Bid accepted and contract created successfully"
        )
    );
});

const getBidsForJob = asyncHandler(async (req, res) => {
    const { jobId } = req.params;

    const bids = await Bid.find({ job: jobId })
        .populate("freelancer", "username fullname")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(
        new ApiResponse(
            200,
            bids,
            "Bids fetched successfully"
        )
    );
});

const getBidById = asyncHandler(async (req, res) => {
    const { bidId } = req.params;

    const bid = await Bid.findById(bidId)
        .populate("freelancer", "username fullname")
        .populate("job");

    if (!bid) {
        throw new ApiError(404, "Bid not found");
    }

    return res
        .status(200)
        .json(
        new ApiResponse(
            200,
            bid,
            "Bid fetched successfully"
        )
    );
});

const updateBid = asyncHandler(async (req, res) => {
    const { bidId } = req.params;
    const { amount, coverLetter } = req.body;

    const bid = await Bid.findById(bidId);

    if (!bid) {
        throw new ApiError(404, "Bid not found");
    }

    // Check if user is the owner of the bid
    if (bid.freelancer.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this bid");
    }

    const updateData = {};
    if (amount) updateData.amount = amount;
    if (coverLetter) updateData.coverLetter = coverLetter;

    const updatedBid = await Bid.findByIdAndUpdate(
        bidId,
        { $set: updateData },
        { new: true }
    );

    return res
        .status(200)
        .json(
        new ApiResponse(
            200,
            updatedBid,
            "Bid updated successfully"
        )
    );
});

const deleteBid = asyncHandler(async (req, res) => {
    const { bidId } = req.params;

    const bid = await Bid.findById(bidId);

    if (!bid) {
        throw new ApiError(404, "Bid not found");
    }

    // Check if user is the owner of the bid
    if (bid.freelancer.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this bid");
    }

    await Bid.findByIdAndDelete(bidId);

    return res
        .status(200)
        .json(
        new ApiResponse(
            200,
            {},
            "Bid deleted successfully"
        )
    );
});

export { postBid, acceptBid, getBidsForJob, getBidById, updateBid, deleteBid }