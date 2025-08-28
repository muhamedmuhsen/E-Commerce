import asyncWrapper from "../middlewares/asyncWrapper.js";
import OrderService from "../services/order.service.js";
import Cart from "../models/cart.model.js";

export const getAllOrdersOfUser = asyncWrapper(async (req, res, next) => {
  const { orders, pagination } = await OrderService.getAllOrders(
    req.query,
    req.user._id
  );

  res.status(200).json({
    success: true,
    message: "Orders retrived successfully",
    pagination,
    data: orders,
  });
});

export const getAllOrders = asyncWrapper(async (req, res, next) => {
  const { orders, pagination } = await OrderService.getAllOrders(req.query);

  res.status(200).json({
    success: true,
    message: "Orders retrived successfully",
    pagination,
    data: orders,
  });
});

export const updateOrder = asyncWrapper();
export const deleteOrder = asyncWrapper(async (req, res, next) => {
  await OrderService.deleteOrder(req.params.id);

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});

export const getOrder = asyncWrapper(async (req, res, next) => {
  const order = await OrderService.getOrder(req.user._id, req.params.id);

  res.status(200).json({
    success: true,
    message: "Order retrived successfully",
    data: order,
  });
});

export const createOrder = asyncWrapper(async (req, res, next) => {
  req.body.cart = req.cart;
  const order = await OrderService.createOrder(req.body, req.user._id);

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order,
  });
});

export const setCart = asyncWrapper(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  req.cart = cart._id;
  next()
});
