export default (err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging
  const statusCode = err.status || 500; // Determine status code
  res
    .status(statusCode)
    .json({ success: false, message: err.message || "Internal Server Error" });
};
