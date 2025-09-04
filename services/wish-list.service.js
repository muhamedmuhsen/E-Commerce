import Product from "../models/product.model.js";
import Wishlist from "../models/wish-list.model.js";
import {BadRequestError, NotFoundError} from "../utils/api-errors.js";

class WishlistService {
    async getWishlist(user) {
        const wishlist = await Wishlist.findOne({user}).lean();
        return wishlist ? wishlist : {product: [], user};
    }

    async addProduct(productId, user) {
        const product = await Product.exists(productId);

        if (!product) throw new NotFoundError("Product not found");

        let wishlist = await Wishlist.findOne({user});

        if (!wishlist) {
            wishlist = await Wishlist.create({product: productId, user});
        } else {
            wishlist = await Wishlist.findOneAndUpdate({user, product: {$ne: productId}}, {
                $push: {product: productId}
            }, {new: true})
        }
        if (!wishlist) throw new BadRequestError("Product already in the wishlist");
        return wishlist;
    }

    async clearWishlist(user) {
        await Wishlist.findOneAndUpdate({user}, {$set: {product: []}}, {
            new: true,
        });
    }

    async removeProduct(productId, userId) {
        const wishlist = await Wishlist.findOneAndUpdate(
            {
                user: userId,
                product: productId
            },
            { $pull: { product: productId } },
            { new: true }
        ).lean()

        if (!wishlist) throw new NotFoundError("Product not found in wishlist");


        return wishlist;
    }
}

export default new WishlistService();
