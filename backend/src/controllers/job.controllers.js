import { Job } from "../models/job.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { UserRolesEnum } from "../utils/constants.js";

const postJob = asyncHandler(async (req, res) => {
    const {title, description, budget, category, type, skills, experienceLevel, deadline} = req.body

    // Check for missing required fields
    const missingFields = [];
    if (!title) missingFields.push('title');
    if (!description) missingFields.push('description');
    if (!budget) missingFields.push('budget');
    if (!category) missingFields.push('category');
    if (!type) missingFields.push('type');
    
    if (missingFields.length > 0) {
        throw new ApiError(400, `Missing required fields: ${missingFields.join(', ')}`);
    }

    // Check field lengths and values
    if (typeof title !== 'string' || title.trim().length < 5) {
        throw new ApiError(400, "Title must be a string and at least 5 characters long");
    }
    
    if (typeof description !== 'string' || description.trim().length < 20) {
        throw new ApiError(400, "Description must be a string and at least 20 characters long");
    }
    
    const budgetValue = parseFloat(budget);
    if (isNaN(budgetValue) || budgetValue < 10) {
        throw new ApiError(400, "Budget must be a valid number and at least $10");
    }

    if (typeof category !== 'string' || category.trim().length === 0) {
        throw new ApiError(400, "Category must be a non-empty string");
    }

    if (![ "OPEN", "DIRECT" ].includes(type)) {
        throw new ApiError(400, "Job type must be either 'OPEN' or 'DIRECT'");
    }

    // Check if user role is properly set
    if (!req.user || !req.user.role) {
        throw new ApiError(403, "User role not found");
    }

    if (req.user.role !== UserRolesEnum.CLIENT) {
        throw new ApiError(403, "Only clients can post jobs");
    }

    const jobData = {
        title: title.trim(),
        description: description.trim(),
        budget: budgetValue,
        category: category.trim(),
        type,
        client: req.user._id,
    };

    // Add optional fields if provided
    if (skills && Array.isArray(skills)) {
        jobData.skills = skills.filter(skill => typeof skill === 'string' && skill.trim().length > 0);
    }
    if (experienceLevel && ["entry", "intermediate", "expert"].includes(experienceLevel)) {
        jobData.experienceLevel = experienceLevel;
    }
    if (deadline) {
        jobData.deadline = deadline;
    }
    
    try {
        const job = await Job.create(jobData);
        
        return res
            .status(201)
            .json(
            new ApiResponse(
                201,
                job,
                "Job posted successfully"
            )
        );
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errorMessages = Object.values(error.errors).map(e => e.message);
            throw new ApiError(400, "Validation failed: " + errorMessages.join(', '));
        }
        throw error;
    }
});

const getAllJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.find({ status: "ACTIVE" })
        .populate("client", "username email")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(
        new ApiResponse(
            200,
            jobs,
            "Jobs fetched successfully"
        )
  );
});

const getJobById = asyncHandler(async (req, res) => {
    const { jobId } = req.params;

    const job = await Job.findById(jobId)
        .populate("client", "username email")
        .populate("bids");

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    return res
        .status(200)
        .json(
        new ApiResponse(
            200,
            job,
            "Job fetched successfully"
        )
  );
});

const updateJob = asyncHandler(async (req, res) => {
    const { jobId } = req.params;
    const { title, description, budget, category, type, skills, experienceLevel, deadline } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    // Check if user role is properly set
    if (!req.user || !req.user.role) {
        throw new ApiError(403, "User role not found");
    }

    // Check if user is the owner of the job
    if (job.client.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this job");
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (budget) updateData.budget = budget;
    if (category) updateData.category = category;
    if (type) updateData.type = type;
    if (skills && Array.isArray(skills)) updateData.skills = skills;
    if (experienceLevel) updateData.experienceLevel = experienceLevel;
    if (deadline) updateData.deadline = deadline;

    const updatedJob = await Job.findByIdAndUpdate(
        jobId,
        { $set: updateData },
        { new: true }
    );

    return res
        .status(200)
        .json(
        new ApiResponse(
            200,
            updatedJob,
            "Job updated successfully"
        )
  );
});

const deleteJob = asyncHandler(async (req, res) => {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
        throw new ApiError(404, "Job not found");
    }

    // Check if user role is properly set
    if (!req.user || !req.user.role) {
        throw new ApiError(403, "User role not found");
    }

    // Check if user is the owner of the job
    if (job.client.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this job");
    }

    await Job.findByIdAndDelete(jobId);

    return res
        .status(200)
        .json(
        new ApiResponse(
            200,
            {},
            "Job deleted successfully"
        )
  );
});

const searchJobs = asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q) {
        throw new ApiError(400, "Search query is required");
    }

    const jobs = await Job.find({
        $or: [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { skills: { $in: [new RegExp(q, 'i')] } }
        ],
        status: "ACTIVE"
    })
    .populate("client", "username email")
    .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(
        new ApiResponse(
            200,
            jobs,
            "Jobs searched successfully"
        )
  );
});

const getJobsByClient = asyncHandler(async (req, res) => {
    // Check if user role is properly set
    if (!req.user || !req.user.role) {
        throw new ApiError(403, "User role not found");
    }

    // Only clients should be able to view their own jobs
    if (req.user.role !== "client") {
        throw new ApiError(403, "Only clients can view their own jobs");
    }

    console.log("Fetching jobs for client:", req.user._id);
    
    const jobs = await Job.find({ client: req.user._id })
        .populate("client", "username email")
        .sort({ createdAt: -1 });
    
    console.log("Found jobs:", jobs.length);

    return res
        .status(200)
        .json(
        new ApiResponse(
            200,
            jobs,
            "Client jobs fetched successfully"
        )
  );
});

export {
    postJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    searchJobs,
    getJobsByClient
};