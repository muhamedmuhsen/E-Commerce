import Product from "../models/product.model.js";
import Wishlist from "../models/wish-list.model.js";
import {BadRequestError, NotFoundError} from "../utils/api-errors.js";
import BaseService from "./base.service.js";

class WishlistService {
    #Wishlist
    #Product
    #BaseService

    constructor(BaseService, Wishlist, Product) {
        this.#Wishlist = Wishlist;
        this.#Product = Product;
        this.#BaseService = BaseService;
    }

    async getWishlist(user) {
        const wishlist = await this.#Wishlist.findOne({user});
        return wishlist ? wishlist : {product: [], user};
    }

    async addProduct(productId, user) {

        if (!await this.#Product.exists({_id: productId})) {
            throw new NotFoundError("Product not found");
        }

        const wishlist = await this.#Wishlist.findOneAndUpdate(
            {
                user,
                product: {$ne: productId}
            },
            {$push: {product: productId}},
            {new: true, upsert: true}
        );

        if (!wishlist) {
            throw new BadRequestError("Product already in the wishlist");
        }
        return wishlist;
    }

    async clearWishlist(user) {
        if (!await this.#Wishlist.exists({user})) throw new NotFoundError("This user doesn't have a wishlist");

        await this.#Wishlist.findOneAndUpdate({user}, {$set: {product: []}}, {
            new: true,
        });
    }

    async removeProduct(productId, userId) {
        if (!await this.#Wishlist.exists({user})) throw new NotFoundError("This user doesn't have a wishlist");
        if (!await this.#Product.exists({_id: productId})) throw new NotFoundError("Product does not exist");

        const wishlist = await this.#Wishlist.findOneAndUpdate({
            user: userId, product: productId
        }, {$pull: {product: productId}}, {new: true}).lean()

        if (!wishlist) throw new NotFoundError("Product not found in wishlist");

        return wishlist;
    }
}

export default new WishlistService(BaseService, Wishlist, Product);
