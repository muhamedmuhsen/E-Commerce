import express from "express";
import authenticateJWT from "../middlewares/authenticateJWT.js";
import isAllowed from "../middlewares/isAllowed.js";
import {
  getAllOrders,
  getAllOrdersOfUser,
  createOrder,
  updateOrder,
  deleteOrder,
  getSpecificOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

router.use(authenticateJWT);

router.route("/user/").get(getAllOrders);

router.route("/").get(isAllowed("admin"), getAllOrders).post(createOrder);

router
  .route("/:id")
  .put(updateOrder)
  .delete(isAllowed("admin"), deleteOrder)
  .get(getSpecificOrder);

export default router;
