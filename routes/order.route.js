import express from "express";
import authenticateJWT from "../middlewares/authenticate-jwt.js";
import isAllowed from "../middlewares/is-allowed.js";
import * as OrderController from "../controllers/order.controller.js";
import {
  deleteOrderValidator,
  getOrderValidator,
  createOrderValidator,
} from "../validators/order.validator.js";

const router = express.Router();

router.use(authenticateJWT);

router.get("/user/",OrderController.getAllOrders);

router.get("/", isAllowed("admin"), OrderController.getAllOrders);

router.post("/direct", OrderController.createOrder);
router.post("/from-cart", OrderController.setCart, OrderController.createOrder);

router.put("/status/:id", OrderController.updateOrderStatus)

router
  .route("/:id")
  .put(OrderController.updateOrder)
  .delete(isAllowed("admin"), deleteOrderValidator, OrderController.deleteOrder)
  .get(getOrderValidator, OrderController.getOrder);

// place an order
export default router;
