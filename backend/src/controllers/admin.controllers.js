import { User } from "../models/user.models.js";
import { Job } from "../models/job.models.js";
import { Contract } from "../models/contract.models.js";
import { Dispute } from "../models/dispute.models.js";
import { Escrow } from "../models/escrow.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

// Get dashboard stats
const getDashboardStats = asyncHandler(async (req, res) => {
    // Verify admin
    if (req.user.role !== "admin") {
        throw new ApiError(403, "Admin access required");
    }

    const totalUsers = await User.countDocuments();
    const activeContracts = await Contract.countDocuments({ status: "active" });
    const pendingDisputes = await Dispute.countDocuments({ status: { $in: ["pending", "in-review"] } });
    
    // Calculate total revenue (sum of all completed contracts)
    const revenueData = await Contract.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$agreedRate" } } }
    ]);
    
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;
    const platformFee = totalRevenue * 0.1; // Assuming 10% platform fee

    return res.status(200).json(
        new ApiResponse(200, {
            totalUsers,
            activeContracts,
            pendingDisputes,
            totalRevenue,
            platformFee
        }, "Dashboard stats fetched successfully")
    );
});

// Get all users with filters
const getAllUsers = asyncHandler(async (req, res) => {
    if (req.user.role !== "admin") {
        throw new ApiError(403, "Admin access required");
    }

    const { role, status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;

    const users = await User.find(filter)
        .select("-password -refreshToken")
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const count = await User.countDocuments(filter);

    return res.status(200).json(
        new ApiResponse(200, {
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        }, "Users fetched successfully")
    );
});

// Get all disputes
const getAllDisputes = asyncHandler(async (req, res) => {
    if (req.user.role !== "admin") {
        throw new ApiError(403, "Admin access required");
    }

    const { status } = req.query;
    const filter = status ? { status } : {};

    const disputes = await Dispute.find(filter)
        .populate("job", "title")
        .populate("raisedBy", "username email")
        .populate("contract", "agreedRate")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, disputes, "Disputes fetched successfully")
    );
});

// Get all transactions
const getAllTransactions = asyncHandler(async (req, res) => {
    if (req.user.role !== "admin") {
        throw new ApiError(403, "Admin access required");
    }

    const escrows = await Escrow.find()
        .populate("job", "title")
        .populate("client", "username email")
        .populate("freelancer", "username email")
        .sort({ createdAt: -1 })
        .limit(50);

    return res.status(200).json(
        new ApiResponse(200, escrows, "Transactions fetched successfully")
    );
});

// Update user status
const updateUserStatus = asyncHandler(async (req, res) => {
    if (req.user.role !== "admin") {
        throw new ApiError(403, "Admin access required");
    }

    const { userId } = req.params;
    const { status } = req.body;

    const user = await User.findByIdAndUpdate(
        userId,
        { status },
        { new: true }
    ).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, user, "User status updated successfully")
    );
});

export {
    getDashboardStats,
    getAllUsers,
    getAllDisputes,
    getAllTransactions,
    updateUserStatus
};
