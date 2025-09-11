import asyncWrapper from "../middlewares/async-wrapper.js";
import CartService from "../services/cart.service.js";

class CartController {
    #CartService

    constructor(CartService) {
        this.#CartService = CartService;
    }

    wrap(fn) {
        return asyncWrapper(fn.bind(this))
    }

    async getCartItems(req, res) {
        const products = await this.#CartService.getCartProducts(req.user._id);

        res.status(200).json({
            success: true, message: "Products retrieved successfully", data:  products
        });
    }

    async addItem(req, res,) {
        const cart = await this.#CartService.addToCart(req.body.productId, req.body.color, req.user._id);

        res.status(201).json({
            success: true, message: "Item add to the cart successfully", data: {
                length: cart.cartItems.length, cart,
            },
        });
    }

    async clearCartItems(req, res,) {
        await this.#CartService.clearCartItems(req.user._id);

        res.status(200).json({
            success: true, message: "All Items deleted successfully",
        });
    }

    async updateProductQuantity(req, res,) {
        const cart = await this.#CartService.updateProductQuantity(req.user._id, req.body.quantity, req.params.id.toString());

        res.status(200).json({success: true, message: "item updated successfully", data: cart});
    }

    async removeItem(req, res,) {
        const cart = await this.#CartService.removeProductFromCart(req.params.id, req.user._id);

        res.status(200).json({
            success: true, message: "item deleted successfully", data: {
                length: cart.length, cart,
            },
        });
    }

    // need to move to coupon controller
    async applyCoupon(req, res,) {
        const cart = await this.#CartService.applyCoupon(req.body.name, req.user._id);

        res.status(200).json({
            success: true, message: "Coupon applied successfully", data: cart,
        });
    }
}

export default new CartController(CartService)