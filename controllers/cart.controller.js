import asyncWrapper from "../middlewares/async-wrapper.js";
import { NotFoundError } from "../utils/api-errors.js";
import {
  addToCartService,
  getCartProductsService,
  removeSpecificCartItemService,
  removeAllFromCartService,
  updateCartItemQuantityService,
  applyCouponService,
} from "../services/cart.service.js";

/**
 * @desc   Get user's cart with all products
 * @route  GET /api/v1/cart
 * @access Private
 */
export const getCartProducts = asyncWrapper(async (req, res, next) => {
  const cart = await getCartProductsService(req.user._id);

  res.status(200).json({
    success: true,
    message: "cart found successfully",
    data: {
      length: cart.length,
      cart,
    },
  });
});

/**
 * @desc   Add product to user's cart
 * @route  POST /api/v1/cart
 * @access Private
 */
export const addToCart = asyncWrapper(async (req, res, next) => {
  const cart = await addToCartService(
    req.body.productId,
    req.body.color,
    req.user._id
  );

  res.status(201).json({
    success: true,
    message: "Item add to the cart successfully",
    data: {
      length: cart.length,
      cart,
    },
  });
});

/**
 * @desc   Remove all items from user's cart
 * @route  DELETE /api/v1/cart
 * @access Private
 */
export const removeAllFromCart = asyncWrapper(async (req, res, next) => {
  const cart = await removeAllFromCartService(req.user._id);

  res.status(200).json({
    success: true,
    message: "item deleted successfully",

    data: {
      length: cart.length,
      cart,
    },
  });
});

/**
 * @desc   Update quantity of specific cart item
 * @route  PUT /api/v1/cart/:id
 * @access Private
 */
export const updateCartItemQuantity = asyncWrapper(async (req, res, next) => {
  const cart = await updateCartItemQuantityService(
    req.user._id,
    req.body.quantity,
    req.params.id.toString()
  );

  res
    .status(200)
    .json({ success: true, message: "item updated successfully", data: cart });
});

/**
 * @desc   Remove specific item from user's cart
 * @route  DELETE /api/v1/cart/:id
 * @access Private
 */
export const removeSpecificCartItem = asyncWrapper(async (req, res, next) => {
  const cart = await removeSpecificCartItemService(req.params.id, req.user._id);

  res.status(200).json({
    success: true,
    message: "item deleted successfully",
    data: {
      length: cart.length,
      cart,
    },
  });
});

export const applyCoupon = asyncWrapper(async (req, res, next) => {
  const cart = await applyCouponService(req.body.name, req.user._id);
  
  res.status(200).json({
    success: true,
    message: "Coupon applied successfully",
    data: cart,
  });
});
