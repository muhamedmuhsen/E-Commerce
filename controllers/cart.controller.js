import asyncWrapper from "../middlewares/async-wrapper.js";
import CartService from "../services/cart.service.js";

class CartController {
    #CartService

    constructor(CartService) {
        this.CartService = CartService;
    }
    wrap(fn){
        return asyncWrapper(fn.bind(this))
    }
    async getCartItems(req, res, next) {
        const products = await this.#CartService.getCartProducts(req.user._id);

        res.status(200).json({
            success: true, message: "cart found successfully", data: {length: products.length, products},
        });
    }

    async addItem(req, res, next) {
        const cart = await this.#CartService.addToCart(req.body.productId, req.body.color, req.user._id);

        res.status(201).json({
            success: true, message: "Item add to the cart successfully", data: {
                length: cart.cartItems.length, cart,
            },
        });
    }

    async clearCartItems(req, res, next) {
        const cart = await this.#CartService.removeAllFromCart(req.user._id);

        res.status(200).json({
            success: true, message: "All Items deleted successfully",
        });
    }

    async updateProductQuantity(req, res, next) {
        const cart = await this.#CartService.updateProductQuantity(req.user._id, req.body.quantity, req.params.id.toString());

        res.status(200).json({success: true, message: "item updated successfully", data: cart});
    }

    async removeItem(req, res, next) {
        const cart = await this.#CartService.removeProductFromCart(req.params.id, req.user._id);

        res.status(200).json({
            success: true, message: "item deleted successfully", data: {
                length: cart.length, cart,
            },
        });
    }

    // need to move to coupon controller
    async applyCoupon(req, res, next) {
        const cart = await this.#CartService.applyCoupon(req.body.name, req.user._id);

        res.status(200).json({
            success: true, message: "Coupon applied successfully", data: cart,
        });
    }
}

export default new CartController(CartService)