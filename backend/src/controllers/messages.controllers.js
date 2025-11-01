import { Conversation } from "../models/conversations.models.js";
import { Message } from "../models/messages.models.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

// Create or get conversation
export const startConversation = asyncHandler(async (req, res) => {
  const { receiverIdentifier, jobId, contractId } = req.body;
  const userId = req.user._id;

  // Validate input
  if (!receiverIdentifier) {
    throw new ApiError(400, "Receiver identifier is required");
  }

  try {
    // Find receiver by ID, email, or username
    let receiver;
    if (receiverIdentifier.includes('@')) {
      // Email
      receiver = await User.findOne({ email: receiverIdentifier });
    } else if (receiverIdentifier.match(/^[0-9a-fA-F]{24}$/)) {
      // ObjectId
      receiver = await User.findById(receiverIdentifier);
    } else {
      // Username
      receiver = await User.findOne({ username: receiverIdentifier });
    }

    if (!receiver) {
      throw new ApiError(404, "User not found. Please check the username, email, or ID.");
    }

    if (receiver._id.toString() === userId.toString()) {
      throw new ApiError(400, "You cannot start a conversation with yourself.");
    }

    const receiverId = receiver._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverId] },
      ...(jobId && { job: jobId }),
    });

    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        participants: [userId, receiverId],
        ...(jobId && { job: jobId }),
        ...(contractId && { contract: contractId }),
      });
    }

    // Populate the conversation with participant details
    const populatedConversation = await Conversation.findById(conversation._id)
      .populate("participants", "username email role")
      .populate("job", "title")
      .populate("contract", "title");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          populatedConversation,
          "Conversation started successfully"
        )
      );
  } catch (error) {
    console.error("Error starting conversation:", error);
    throw new ApiError(500, "Failed to start conversation");
  }
});

// Get user's conversations
export const getUserConversations = asyncHandler(async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "username email role avatar")
      .populate("job", "title")
      .populate("contract", "title")
      .sort({ updatedAt: -1 })
      .limit(50);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          conversations,
          "Conversations fetched successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw new ApiError(500, "Failed to fetch conversations");
  }
});

// Get messages for a conversation
export const getMessages = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;

  try {
    // Verify user is part of the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    });

    if (!conversation) {
      throw new ApiError(404, "Conversation not found");
    }

    const messages = await Message.find({ conversationId })
      .populate("sender", "username email role avatar")
      .sort({ createdAt: 1 });

    return res
      .status(200)
      .json(new ApiResponse(200, messages, "Messages fetched successfully"));
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new ApiError(500, "Failed to fetch messages");
  }
});

// Send message
export const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId, text, fileUrl } = req.body;

  try {
    // Verify user is part of the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id,
    });

    if (!conversation) {
      throw new ApiError(404, "Conversation not found");
    }

    if (!text && !fileUrl) {
      throw new ApiError(400, "Message text or file is required");
    }

    // Create message
    const message = await Message.create({
      conversationId,
      sender: req.user._id,
      text: text || "",
      fileUrl: fileUrl || null,
    });

    // Populate sender info
    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "username email role avatar"
    );

    // Update conversation's updatedAt timestamp
    await Conversation.findByIdAndUpdate(conversationId, {
      updatedAt: new Date(),
    });

    // Emit message via Socket.io if available
    const io = req.app.get('io');
    if (io) {
      io.to(conversationId).emit("newMessage", populatedMessage);
    }

    return res
      .status(201)
      .json(
        new ApiResponse(201, populatedMessage, "Message sent successfully")
      );
  } catch (error) {
    console.error("Error sending message:", error);
    throw new ApiError(500, "Failed to send message");
  }
});