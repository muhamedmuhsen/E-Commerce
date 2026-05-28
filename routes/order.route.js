import express from "express";
import authenticateJWT from "../middlewares/authenticate-jwt.js";
import isAllowed from "../middlewares/is-allowed.js";
import OrderController from "../controllers/order.controller.js";
import {
    deleteOrderValidator, getOrderValidator, createOrderValidator,
} from "../validators/order.validator.js";

const router = express.Router();

router.use(authenticateJWT);

router.get("/user/", OrderController.wrap(OrderController.getAllOrders));

router.get("/", isAllowed("admin"), OrderController.wrap(OrderController.getAllOrders));

router.post("/direct", OrderController.wrap(OrderController.createOrder));
router.post("/from-cart", OrderController.wrap(OrderController.setCart), OrderController.wrap(OrderController.createOrder));

router.put("/status/:id", OrderController.wrap(OrderController.updateOrderStatus))

router
    .route("/:id")
    .put(OrderController.wrap(OrderController.updateOrder))
    .delete(isAllowed("admin"), deleteOrderValidator, OrderController.wrap(OrderController.deleteOrder))
    .get(getOrderValidator, OrderController.wrap(OrderController.getOrder));

// place an order


export default router;
