/**
 * @desc Middleware to handle 404 Not Found errors
 * @route Any undefined route
 * @access Public
 */
export const notFound = (req, res, next) => {
    // Create error with message and attach the original URL
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    next(error); // Pass error to the next middleware (error handler)
  };
  
  /**
   * @desc Centralized error handling middleware
   * @param {Error} err - Error object passed from previous middleware
   * @route Any
   * @access Public
   */
  export const errorMiddleware = (err, req, res, next) => {
    // If headers are already sent, delegate to the default Express error handler
    if (res.headersSent) {
      return next(err);
    }
  
    // Set status code (default to 500 if not provided)
    res.status(err.status || 500).json({
      message: err.message || "An unknown error occurred", // Return error message or fallback
    });
  };
  