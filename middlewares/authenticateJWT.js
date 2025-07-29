import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncWrapper from "./asyncWrapper.js";

export default asyncWrapper(async (req, res, next) => {
  // try {
  //   const token = req.header("Authorization")?.split(" ")[1];

  //   if (!token) {
  //     return next(new ApiError("Access denied", 401));
  //   }

  //   console.log(token);

  //   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
  //     if (err) return res.status(401).send("Invalid Token"); // Token verification failed

  //     // If verification is successful, attach user data to request object
  //     req.user = user;

  //     // Pass control to the next middleware or route handler
  //     next();
  //   });

  const { authorization: authHeader } = req.headers;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError("Access denied", 401));
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    return next(new ApiError("Access denied", 401));
  }

  console.log(process.env.JWT_SECRET);

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  // TODO(check if the user found in another function)
  const user = await User.findById(decode.userId);

  if (!user || user.role !== "admin") {
    return next(new ApiError("Unauthorized user", 401));
  }

  req.user = user;
  next();

  // } catch (error) {
  //   return next(new ApiError("Invalid token", 401));
  // }
});
