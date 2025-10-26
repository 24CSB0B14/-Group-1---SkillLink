import { Dispute } from "../models/dispute.models.js";
import { Escrow } from "../models/escrow.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

// 1️⃣ Create a dispute (client or freelancer)
export const createDispute = asyncHandler(async (req, res) => {
  const { escrowId, reason } = req.body;
  
  // Check if escrow exists
  const escrow = await Escrow.findById(escrowId);
  if (!escrow) throw new ApiError(404, "Escrow not found");
  
  // Check if user is authorized to raise dispute (client or freelancer)
  if (req.user._id.toString() !== escrow.client.toString() && 
      req.user._id.toString() !== escrow.freelancer.toString()) {
    throw new ApiError(403, "Not authorized to raise dispute for this escrow");
  }
  
  // Check if dispute already exists for this escrow
  const existingDispute = await Dispute.findOne({ escrow: escrowId });
  if (existingDispute) throw new ApiError(400, "Dispute already exists for this escrow");
  
  // Create dispute
  const dispute = await Dispute.create({
    escrow: escrowId,
    raisedBy: req.user._id,
    reason,
    status: "pending"
  });
  
  // Update escrow status
  escrow.status = "disputed";
  escrow.dispute = { isDisputed: true, disputedAt: new Date(), resolution: reason };
  await escrow.save();
  
  res.status(201).json(new ApiResponse(201, dispute, "Dispute created successfully"));
});

// 2️⃣ Get all disputes (admin)
export const getAllDisputes = asyncHandler(async (req, res) => {
  const disputes = await Dispute.find()
    .populate("escrow")
    .populate("raisedBy", "username email")
    .sort({ createdAt: -1 });
  
  res.status(200).json(new ApiResponse(200, disputes, "Disputes fetched successfully"));
});

// 3️⃣ Get dispute by ID (admin or parties involved)
export const getDisputeById = asyncHandler(async (req, res) => {
  const { disputeId } = req.params;
  
  const dispute = await Dispute.findById(disputeId)
    .populate("escrow")
    .populate("raisedBy", "username email");
  
  if (!dispute) throw new ApiError(404, "Dispute not found");
  
  // Check if user is authorized to view dispute
  if (req.user.role !== "admin" && 
      req.user._id.toString() !== dispute.raisedBy.toString()) {
    throw new ApiError(403, "Not authorized to view this dispute");
  }
  
  res.status(200).json(new ApiResponse(200, dispute, "Dispute fetched successfully"));
});

// 4️⃣ Resolve dispute (admin)
export const resolveDispute = asyncHandler(async (req, res) => {
  const { disputeId } = req.params;
  const { decision, resolutionNotes } = req.body;
  
  const dispute = await Dispute.findById(disputeId);
  if (!dispute) throw new ApiError(404, "Dispute not found");
  
  // Update dispute
  dispute.status = "resolved";
  dispute.decision = decision;
  dispute.resolutionNotes = resolutionNotes;
  dispute.resolvedAt = new Date();
  dispute.resolvedBy = req.user._id;
  await dispute.save();
  
  // Update escrow based on decision
  const escrow = await Escrow.findById(dispute.escrow);
  if (escrow) {
    switch (decision) {
      case "client":
        escrow.status = "refunded";
        escrow.refundedAmount = escrow.heldAmount;
        break;
      case "freelancer":
        escrow.status = "released";
        escrow.releasedAmount = escrow.heldAmount;
        break;
      case "split":
        // For split, we would need to implement split logic
        escrow.status = "partially_released";
        break;
      default:
        break;
    }
    await escrow.save();
  }
  
  res.status(200).json(new ApiResponse(200, dispute, "Dispute resolved successfully"));
});

// 5️⃣ Get disputes by user (client or freelancer)
export const getDisputesByUser = asyncHandler(async (req, res) => {
  const disputes = await Dispute.find({ raisedBy: req.user._id })
    .populate("escrow")
    .sort({ createdAt: -1 });
  
  res.status(200).json(new ApiResponse(200, disputes, "User disputes fetched successfully"));
});