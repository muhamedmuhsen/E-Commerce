import Product from "../models/product.model.js";
import Wishlist from "../models/wish-list.model.js";
import { NotFoundError } from "../utils/api-errors.js";

class WishlistService {
  async getAllProducts(user) {
    const wishlist = await Wishlist.findOne({ user }).lean();

    return wishlist ? wishlist : { product: [], user };
  }

  async addProductToWishlist(productId, user) {
    const product = await Product.findById(productId).lean();

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    let wishlist = await Wishlist.findOne({ user });

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
  }

  async clearWishlist(user) {
    await Wishlist.findOneAndUpdate(
      { user },
      { $set: { product: [] } },
      {
        new: true,
      }
    );
  }

  async deleteProductFromWishlist(productId, user) {
    const product = await Product.findById(productId);

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    let wishlist = await Wishlist.findOne({ user, product: productId });

    if (!wishlist) {
      throw new NotFoundError("Wishlist not found");
    }

    wishlist = await Wishlist.findOneAndUpdate(
      { user },
      {
        $pull: { product: productId },
      },
      { new: true }
    ).populate("product");

    return wishlist;
  }
}

export default new WishlistService();
