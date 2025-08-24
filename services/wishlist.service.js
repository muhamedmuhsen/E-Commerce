import Product from "../models/product.model.js";
import Wishlist from "../models/wishlist.model.js";
import { NotFoundError } from "../utils/ApiErrors.js";

export const getAllProductsInWishlistService = async (user) => {
  const wishlist = await Wishlist.findOne({ user }).populate("product").lean();

  return wishlist ? wishlist : { product: [], user };
};

export const addProductToWishlistService = async (productId, user) => {
  const product = await Product.findById(productId).lean();

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  let wishlist = await Wishlist.findOne({ user }).populate("product");

  if (!wishlist) {
    wishlist = new Wishlist({ product: productId, user });
  } else {
    const flag = wishlist.product.some((ele) => {
      return ele._id.toString() === productId;
    });

    if (!flag) wishlist.product.push(productId);
  }
  await wishlist.save();
  return wishlist;
};

export const removeAllFromWishlistService = async (user) => {
  const wishlist = await Wishlist.findOneAndUpdate(
    { user },
    { $set: { product: [] } },
    {
      new: true,
    }
  ).populate("product");

  return wishlist ? wishlist : { product: [], user };
};

export const removeProductFromWishlistService = async (productId, user) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  let wishlist = await Wishlist.findOne({ user });

  if (!wishlist) {
    throw new NotFoundError("Wishlist not found");
  }

  const flag = wishlist.product.some((ele) => ele.toString() === productId);

  if (!flag) {
    throw new NotFoundError("This product isn't in the wishlist");
  }

  wishlist = await Wishlist.findOneAndUpdate(
    { user },
    {
      $pull: { product: productId },
    },
    { new: true }
  ).populate("product");

  return wishlist;
};
