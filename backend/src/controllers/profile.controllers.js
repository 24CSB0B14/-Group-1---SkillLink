import { User } from "../models/user.models.js";
import { ClientProfile } from "../models/clientProfile.models.js";
import { FreelancerProfile } from "../models/freelancerProfile.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { UserRolesEnum } from "../utils/constants.js";

const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .select("username email role clientProfile freelancerProfile") // only essential user fields
        .populate({
            path: "clientProfile",
            select: "companyName logo contact about walletBalance jobsPosted" // only client fields
        })
        .populate({
            path: "freelancerProfile",
            select: "skills portfolio hourlyRate experience walletBalance" // only freelancer fields
        });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    let profileData;
    if (user.role === UserRolesEnum.CLIENT) {
        profileData = await ClientProfile.findOne({ user: req.user._id }).select(
            "companyName logo contact about"
        );
    } 
    else if (user.role === UserRolesEnum.FREELANCER) {
        profileData = await FreelancerProfile.findOne({ user: req.user._id }).select(
            "skills portfolio hourlyRate experience"
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                username: user.username,
                email: user.email,
                role: user.role,
                profile: profileData
            },
            "Profile fetched successfully"
        )
    );
})

const updateProfile = asyncHandler(async (req, res) => {
    const { role } = req.user;
    const updateData = req.body;

    let updatedProfile;
    if (role === UserRolesEnum.CLIENT) {
        updatedProfile = await ClientProfile.findOneAndUpdate(
            {user: req.user._id},
            {$set: updateData},
            {new: true}
        );
    }
    else if (role === UserRolesEnum.FREELANCER) {
        updatedProfile = await FreelancerProfile.findOneAndUpdate(
            {user: req.user._id},
            {$set: updateData},
            {new: true}
        );
    }

    if (!updatedProfile) {
        throw new ApiError(404, "Profile not found");
    }

    res
    .status(200)
    .json(
        new ApiResponse(
        200, 
        updatedProfile, 
        "Profile updated successfully")
    );
})

// Get all freelancers for directory
const getAllFreelancers = asyncHandler(async (req, res) => {
    const { skills, search, limit = 50 } = req.query;
    
    const filter = { role: UserRolesEnum.FREELANCER };
    
    if (search) {
        filter.$or = [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }
    
    const freelancers = await User.find(filter)
        .select('username email role freelancerProfile')
        .populate({
            path: 'freelancerProfile',
            select: 'skills hourlyRate experience portfolio'
        })
        .limit(parseInt(limit));
    
    return res.status(200).json(
        new ApiResponse(200, freelancers, "Freelancers fetched successfully")
    );
});

// Get public profile by user ID
const getPublicProfile = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
        .select('username email role clientProfile freelancerProfile')
        .populate('clientProfile')
        .populate('freelancerProfile');
    
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    
    return res.status(200).json(
        new ApiResponse(200, user, "Public profile fetched successfully")
    );
});

export { getProfile, updateProfile, getAllFreelancers, getPublicProfile }