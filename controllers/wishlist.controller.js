import asyncWrapper from "../middlewares/asyncWrapper.js";
import {
  addProductToWishlistService,
  getAllProductsInWishlistService,
  removeAllFromWishlistService,
  removeProductFromWishlistService,
} from "../services/wishlist.service.js";

export const getAllProductsInWishlist = asyncWrapper(async (req, res, next) => {
  const wishlist = await getAllProductsInWishlistService(req.user._id);
  res.status(200).json({
    success: true,
    message: "Wishlist retrived successfully",
    data: wishlist,
  });
});

export const addProductToWishlist = asyncWrapper(async (req, res, next) => {
  const productId = req.body.productId;

  const wishlist = await addProductToWishlistService(productId, req.user._id);

  res.status(200).json({
    success: true,
    message: "Product add successfully to the wishlist",
    data: wishlist,
  });
});

export const removeAllFromWishlist = asyncWrapper(async (req, res, next) => {
  const wishlist = await removeAllFromWishlistService(req.user._id);

  res.status(200).json({
    success: true,
    message: "Removed all products from the wishlist successfully",
    data: wishlist,
  });
});

export const removeProductFromWishlist = asyncWrapper(
  async (req, res, next) => {
    const wishlist = await removeProductFromWishlistService(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      message: "Product removed from the wishlist successfully",
      data: wishlist,
    });
  }
);
