import pkg from "jsonwebtoken";
const { JsonWebTokenError, TokenExpiredError } = pkg;

export default (err, req, res, next) => {

  // Use the statusCode from the error object, or default to 500
  let statusCode = err.statusCode || 500;

  // Use the status from the error object, or default based on statusCode
  let status = err.status;
  if (!status) {
    status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
  }

  if (err instanceof TokenExpiredError) {
    err.message = "Unauthorized! Access Token was expired!";
    statusCode = 401;
  }

  if (err instanceof JsonWebTokenError) {
    err.message = "JWT Malformed";
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    status: status,
    code: statusCode,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), 
  });
};
