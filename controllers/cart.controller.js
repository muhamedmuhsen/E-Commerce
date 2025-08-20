import asyncWrapper from "../middlewares/asyncWrapper.js";
import { NotFoundError } from "../utils/ApiErrors.js";
import {
  addToCartService,
  getCartProductsService,
  removeSpecificCartItemService,
  removeAllFromCartService,
  updateCartItemQuantityService,
} from "../services/cart.service.js";

export const getCartProducts = asyncWrapper(async (req, res, next) => {
  const user = req.user;

  const cart = await getCartProductsService(user._id);

  if (!cart) {
    return next(new NotFoundError("this user doesn't have a cart"));
  }

  res.status(200).json({
    success: true,
    message: "cart found successfully",
    items: cart.length,
    data: cart,
  });
});

export const addToCart = asyncWrapper(async (req, res, next) => {
  const { productId, color } = req.body;
  const user = req.user;

  const cart = await addToCartService(productId, color, user._id);
  console.log(cart);

  if (!cart) {
    console.log("no cart");
  }

  res.status(201).json({
    success: true,
    message: "Item add to the cart successfully",
    length: cart.length,
    data: cart,
  });
});

export const removeAllFromCart = asyncWrapper(async (req, res, next) => {
  const id = req.user._id;

  const cart = await removeAllFromCartService(id);
  console.log(cart);

  if (!cart) {
    return next(new NotFoundError("this user doesn't have cart"));
  }

  res.status(200).json({
    success: true,
    message: "item deleted successfully",
    items: cart.length,
    data: cart,
  });
});

export const updateCartItemQuantity = asyncWrapper(async (req, res, next) => {
  const id = req.params.id;

  const cart = await updateCartItemQuantityService(
    req.user._id,
    req.body.quantity,
    id.toString()
  );

  if (!cart) {
    return next(new NotFoundError(`this cart doesn't have this product`));
  }

  res
    .status(200)
    .json({ success: true, message: "item updated successfully", data: cart });
});

export const removeSpecificCartItem = asyncWrapper(async (req, res, next) => {
  const productId = req.params.id;

  const cart = await removeSpecificCartItemService(productId, req.user._id);

  if (!cart) {
    return next(new NotFoundError("this user doesn't have cart"));
  }

  res.status(200).json({
    success: true,
    message: "item deleted successfully",
    items: cart.length,
    data: cart,
  });
});
