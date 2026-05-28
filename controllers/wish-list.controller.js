import asyncWrapper from "../middlewares/async-wrapper.js";
import WishlistService from "../services/wish-list.service.js";


class WishListController {
    #wishlistService
    constructor(wishlistService) {
        this.#wishlistService = wishlistService;
    }

    wrap(fn) {
        return asyncWrapper(fn.bind(this));
    }

    async getWishlist(req, res, next) {
        const products = await this.#wishlistService.getWishlist(req.user._id);
        res.status(200).json({
            success: true,
            message: "Wishlist retrieved successfully",
            data: products,
        });
    }

    async addProduct(req, res, next) {
        const wishlist = await this.#wishlistService.addProduct(
            req.body.productId,
            req.user._id
        );

        res.status(200).json({
            success: true,
            message: "Product added successfully",
            data: wishlist,
        });
    }

    async clearWishlist(req, res, next) {
        const wishlist = await this.#wishlistService.clearWishlist(req.user._id);

        res.status(200).json({
            success: true,
            message: "All products removed from wishlist successfully",
            data: wishlist,
        });
    }

    async removeProduct(req, res, next) {
        const wishlist = await this.#wishlistService.removeProduct(
            req.params.id,
            req.user._id
        );
        res.status(200).json({
            success: true,
            message: "Product removed from wishlist successfully",
            data: wishlist,
        });
    }
}

export default new WishListController(WishlistService)

