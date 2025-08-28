import express from "express";
import authenticateJWT from "../middlewares/authenticateJWT.js";
import isAllowed from "../middlewares/isAllowed.js";
import {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  setCart,
} from "../controllers/order.controller.js";
import {
  deleteOrderValidator,
  getOrderValidator,
  createOrderValidator,
} from "../validators/validateOrderRequest.js";

const router = express.Router();

router.use(authenticateJWT);

router.route("/user/").get(getAllOrders);

router
  .route("/")
  .get(isAllowed("admin"), getAllOrders)
  .post(setCart, createOrder);

router
  .route("/:id")
  .put(updateOrder)
  .delete(isAllowed("admin"), deleteOrderValidator, deleteOrder)
  .get(getOrderValidator, getOrder);

// cancle order
// update payment method
// place an order
export default router;
