import jwt from "jsonwebtoken";
import HttpError from "../models/errorModel.js";

/**
 * @desc    Middleware to protect routes by verifying JWT tokens
 * @route   Protected (used on any route that requires authentication)
 * @access  Private
 */
const authMiddleware = (req, res, next) => {
    // Get the Authorization header from request
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // Check if the token is present and starts with 'Bearer'
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new HttpError('Authentication required', 401));
    }

    // Extract token from the "Bearer <token>" format
    const token = authHeader.split(' ')[1];

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Store user data in the request object
        req.user = decoded;

        // Proceed to the next middleware or controller
        next();
    } catch (error) {
        // If token is invalid or expired
        return next(new HttpError('Invalid token', 401));
    }
};

export default authMiddleware;
