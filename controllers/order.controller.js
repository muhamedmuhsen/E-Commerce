import asyncWrapper from "../middlewares/async-wrapper.js";
import OrderService from "../services/order.service.js";
import Cart from "../models/cart.model.js";

/**
 * @desc   Get all orders for the logged-in user (with pagination / filters)
 * @route  GET /api/v1/orders/user
 * @access Private
 */
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

/**
 * @desc   Get all orders (admin only)
 * @route  GET /api/v1/orders
 * @access Private/Admin
 */
export const getAllOrders = asyncWrapper(async (req, res, next) => {
  const { orders, pagination } = await OrderService.getAllOrders(req.query);

  res.status(200).json({
    success: true,
    message: "Orders retrived successfully",
    pagination,
    data: orders,
  });
});

/**
 * @desc   Delete order by ID
 * @route  DELETE /api/v1/orders/:id
 * @access Private/Admin
 */
export const deleteOrder = asyncWrapper(async (req, res, next) => {
  await OrderService.deleteOrder(req.params.id);

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});

/**
 * @desc   Get single order by ID for the logged-in user (or admin)
 * @route  GET /api/v1/orders/:id
 * @access Private
 */
export const getOrder = asyncWrapper(async (req, res, next) => {
  const order = await OrderService.getOrder(req.user._id, req.params.id);

  res.status(200).json({
    success: true,
    message: "Order retrived successfully",
    data: order,
  });
});

/**
 * @desc   Create a new order (direct or from cart depending on endpoint)
 * @route  POST /api/v1/orders/direct | POST /api/v1/orders/from-cart
 * @access Private
 */
export const createOrder = asyncWrapper(async (req, res, next) => {
  const order = await OrderService.createOrder(req.body, req.user._id, req.url);

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order,
  });
});

/**
 * @desc   Middleware: attach user's cart items & cart id before creating order
 * @route  POST /api/v1/orders/from-cart
 * @access Private
 */
export const setCart = asyncWrapper(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  req.cart = cart._id;
  req.body.items = cart.cartItems;
  next();
});

/**
 * @desc   Update order (e.g., address, items) owned by user
 * @route  PUT /api/v1/orders/:id
 * @access Private
 */
export const updateOrder = asyncWrapper(async (req, res, next) => {
  const order = await OrderService.updateOrder(
    req.body,
    req.params.id,
    req.user._id
  );

  res.status(200).json({
    success: true,
    message: "Order updated successfully",
    data: order,
  });
});

/**
 * @desc   Toggle / update order status (e.g., paid / shipped) - admin
 * @route  PUT /api/v1/orders/status/:id
 * @access Private/Admin
 */
export const updateOrderStatus = asyncWrapper(async (req, res, next) => {
  const order = await OrderService.updateOrderStatus(req.params.id);

  res.status(200).json({
    success: true,
    message: "Order updated successfully",
    data: order,
  });
});
