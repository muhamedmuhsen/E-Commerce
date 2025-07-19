import {validationResult } from "express-validator";

const validateRequest = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const error = result.errors;
    return res.status(400).json({ success: false, code: 400, error });
  }
  next();
};

export default  validateRequest;
