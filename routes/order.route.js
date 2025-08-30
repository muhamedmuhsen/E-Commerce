import express from "express";
import authenticateJWT from "../middlewares/authenticate-jwt.js";
import isAllowed from "../middlewares/is-allowed.js";
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
} from "../validators/order.validator.js";

const router = express.Router();

router.use(authenticateJWT);

router.route("/user/").get(getAllOrders);

router.get("/", isAllowed("admin"), getAllOrders);

router.post("/direct", createOrder);
router.post("/from-cart", setCart, createOrder);

router
  .route("/:id")
  .put(updateOrder)
  .delete(isAllowed("admin"), deleteOrderValidator, deleteOrder)
  .get(getOrderValidator, getOrder);

// cancle order
// update payment method
// place an order
export default router;
