class ApiError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    if (process.env.NODE_ENV === "development") {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
class UnauthorizedError extends ApiError {
  constructor(message = "Invalid credentials") {
    super(message, 401);
  }
}

class BadRequestError extends ApiError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

class ForbiddenError extends ApiError {
  constructor(message = "Forbidden content") {
    super(message, 403);
  }
}

class NotFoundError extends ApiError {
  constructor(message = "Notfound") {
    super(message, 404);
  }
}
export{
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
};
