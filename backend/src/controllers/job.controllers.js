import { Job } from "../models/job.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { UserRolesEnum } from "../utils/constants.js";

const postJob = asyncHandler(async (req, res) => {
    const {title, description, budget, category, type} = req.body

    if (!title || !description || !budget || !category || !type) {
        throw new ApiError(400, "All fields (title, description, budget, category, type) are required");
    }

    if (![ "OPEN", "DIRECT" ].includes(type)) {
        throw new ApiError(400, "Job type must be either 'OPEN' or 'DIRECT'");
    }

    if (req.user.role !== UserRolesEnum.CLIENT) {
        throw new ApiError(403, "Only clients can post jobs");
    }

    const job = await Job.create({
        title,
        description,
        budget,
        category,
        type,
        client: req.user._id,
    });

    return res
        .status(201)
        .json(
        new ApiResponse(
            201,
            job,
            "Job posted successfully"
        )
  );
})

export { postJob }