import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

/**
 * Generates access and refresh tokens for a user
 * @param {string} userId - The ID of the user
 * @returns {Object} Object containing accessToken and refreshToken
 */
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        // Find the user by ID
        const user = await User.findById(userId);
        
        // Generate access token
        const accessToken = user.generateAccessToken();
        
        // Generate refresh token
        const refreshToken = user.generateRefreshToken();
        
        // Save the refresh token to the user document
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        
        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error("Error generating tokens: " + error.message);
    }
};

export { generateAccessAndRefreshTokens };