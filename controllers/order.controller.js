import asyncWrapper from "../middlewares/asyncWrapper.js";
import OrderService from "../services/order.service.js";

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
export const createOrder = asyncWrapper();
export const updateOrder = asyncWrapper();
export const deleteOrder = asyncWrapper();
export const getSpecificOrder = asyncWrapper();
