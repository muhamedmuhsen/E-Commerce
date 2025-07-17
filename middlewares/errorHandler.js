export default (err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging
  const statusCode = err.statusCode || 500; // Determine status code
  res
    .status(statusCode)
    .json({
      success: false,
      status: err.status || "error",
      message: err.message || "Internal Server Error",
    });
};
