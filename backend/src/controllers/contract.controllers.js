import { Contract } from "../models/contract.models.js";
import { Job } from "../models/job.models.js";
import { Bid } from "../models/bid.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

// Create contract after bid acceptance
const createContract = asyncHandler(async (req, res) => {
    const { jobId, freelancerId, agreedRate, paymentType, terms, deliverables } = req.body;

    // Verify job exists and user is the client
    const job = await Job.findById(jobId);
    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    if (job.client.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only the job owner can create a contract");
    }

    // Check if contract already exists
    const existingContract = await Contract.findOne({ job: jobId });
    if (existingContract) {
        throw new ApiError(400, "Contract already exists for this job");
    }

    // Create contract
    const contract = await Contract.create({
        job: jobId,
        client: req.user._id,
        freelancer: freelancerId,
        agreedRate,
        paymentType: paymentType || "fixed",
        terms,
        deliverables: Array.isArray(deliverables) ? deliverables : [],
        status: "active"
    });

    // Update job status
    job.status = "IN_PROGRESS";
    job.assignedFreelancer = freelancerId;
    await job.save();

    const populatedContract = await Contract.findById(contract._id)
        .populate("client", "username email")
        .populate("freelancer", "username email")
        .populate("job", "title description budget");

    return res.status(201).json(
        new ApiResponse(201, populatedContract, "Contract created successfully")
    );
});

// Get contract by ID
const getContractById = asyncHandler(async (req, res) => {
    const { contractId } = req.params;

    const contract = await Contract.findById(contractId)
        .populate("client", "username email")
        .populate("freelancer", "username email")
        .populate("job", "title description budget category skills");

    if (!contract) {
        throw new ApiError(404, "Contract not found");
    }

    // Check if user is part of the contract
    if (
        contract.client._id.toString() !== req.user._id.toString() &&
        contract.freelancer._id.toString() !== req.user._id.toString()
    ) {
        throw new ApiError(403, "Not authorized to view this contract");
    }

    return res.status(200).json(
        new ApiResponse(200, contract, "Contract fetched successfully")
    );
});

// Get contract by job ID
const getContractByJobId = asyncHandler(async (req, res) => {
    const { jobId } = req.params;

    const contract = await Contract.findOne({ job: jobId })
        .populate("client", "username email")
        .populate("freelancer", "username email")
        .populate("job", "title description budget category skills");

    if (!contract) {
        throw new ApiError(404, "No contract found for this job");
    }

    // Check if user is part of the contract
    if (
        contract.client._id.toString() !== req.user._id.toString() &&
        contract.freelancer._id.toString() !== req.user._id.toString()
    ) {
        throw new ApiError(403, "Not authorized to view this contract");
    }

    return res.status(200).json(
        new ApiResponse(200, contract, "Contract fetched successfully")
    );
});

// Get all contracts for a user (client or freelancer)
const getUserContracts = asyncHandler(async (req, res) => {
    const { status } = req.query;

    const query = {
        $or: [
            { client: req.user._id },
            { freelancer: req.user._id }
        ]
    };

    if (status) {
        query.status = status;
    }

    const contracts = await Contract.find(query)
        .populate("client", "username email")
        .populate("freelancer", "username email")
        .populate("job", "title description budget category")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, contracts, "Contracts fetched successfully")
    );
});

// Update contract status
const updateContractStatus = asyncHandler(async (req, res) => {
    const { contractId } = req.params;
    const { status } = req.body;

    const contract = await Contract.findById(contractId);

    if (!contract) {
        throw new ApiError(404, "Contract not found");
    }

    // Check if user is part of the contract
    if (
        contract.client.toString() !== req.user._id.toString() &&
        contract.freelancer.toString() !== req.user._id.toString()
    ) {
        throw new ApiError(403, "Not authorized to update this contract");
    }

    // Validate status
    const validStatuses = ["active", "completed", "cancelled", "disputed"];
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, "Invalid status");
    }

    contract.status = status;
    if (status === "completed") {
        contract.endDate = new Date();
    }
    await contract.save();

    const updatedContract = await Contract.findById(contractId)
        .populate("client", "username email")
        .populate("freelancer", "username email")
        .populate("job", "title description budget");

    return res.status(200).json(
        new ApiResponse(200, updatedContract, "Contract status updated successfully")
    );
});

// Add milestone to contract
const addMilestone = asyncHandler(async (req, res) => {
    const { contractId } = req.params;
    const { milestoneName, amount, dueDate } = req.body;

    const contract = await Contract.findById(contractId);

    if (!contract) {
        throw new ApiError(404, "Contract not found");
    }

    // Only client can add milestones
    if (contract.client.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only the client can add milestones");
    }

    contract.paymentRules.push({
        milestoneName,
        amount,
        dueDate,
        status: "pending"
    });

    await contract.save();

    return res.status(200).json(
        new ApiResponse(200, contract, "Milestone added successfully")
    );
});

// Complete milestone
const completeMilestone = asyncHandler(async (req, res) => {
    const { contractId, milestoneIndex } = req.params;

    const contract = await Contract.findById(contractId);

    if (!contract) {
        throw new ApiError(404, "Contract not found");
    }

    // Only client can mark milestone as released
    if (contract.client.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Only the client can complete milestones");
    }

    if (!contract.paymentRules[milestoneIndex]) {
        throw new ApiError(404, "Milestone not found");
    }

    contract.paymentRules[milestoneIndex].status = "released";
    await contract.save();

    return res.status(200).json(
        new ApiResponse(200, contract, "Milestone completed successfully")
    );
});

export {
    createContract,
    getContractById,
    getContractByJobId,
    getUserContracts,
    updateContractStatus,
    addMilestone,
    completeMilestone
};
