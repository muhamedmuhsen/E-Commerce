import asyncWrapper from "../middlewares/async-wrapper.js";
import WishlistService from "../services/wish-list.service.js";

/**
 * @desc   Get all products in the authenticated user's wishlist
 * @route  GET /api/v1/wishlist
 * @access Private
 */
export const getAllProductsInWishlist = asyncWrapper(async (req, res, next) => {
  const wishlist = await WishlistService.getAllProducts(req.user._id);
  res.status(200).json({
    success: true,
    message: "Wishlist retrieved successfully",
    data: wishlist,
  });
});

/**
 * @desc   Add a product to the authenticated user's wishlist
 * @route  POST /api/v1/wishlist
 * @access Private
 */
export const addProductToWishlist = asyncWrapper(async (req, res, next) => {
  const productId = req.body.productId;
  const wishlist = await WishlistService.addProductToWishlist(
    productId,
    req.user._id
  );

  res.status(200).json({
    success: true,
    message: "Product added to wishlist successfully",
    data: wishlist,
  });
});

/**
 * @desc   Remove all products from the authenticated user's wishlist
 * @route  DELETE /api/v1/wishlist
 * @access Private
 */
export const removeAllFromWishlist = asyncWrapper(async (req, res, next) => {
  const wishlist = await WishlistService.clearWishlist(req.user._id);

  res.status(200).json({
    success: true,
    message: "All products removed from wishlist successfully",
    data: wishlist,
  });
});

/**
 * @desc   Remove a specific product from the authenticated user's wishlist
 * @route  DELETE /api/v1/wishlist/:id
 * @access Private
 */
export const removeProductFromWishlist = asyncWrapper(async (req, res, next) => {
  const wishlist = await WishlistService.deleteProductFromWishlist(
    req.params.id,
    req.user._id
  );
  res.status(200).json({
    success: true,
    message: "Product removed from wishlist successfully",
    data: wishlist,
  });
});
