import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import {BadRequestError, NotFoundError} from "../utils/api-errors.js";
import Coupon from "../models/coupon.model.js";

class CartService {
    #Cart
    constructor(Cart) {
        this.#Cart = Cart;
    }

    async #findAndIncrementCartItem(user, productId, color, maxQuantity) {
        return Cart.findOneAndUpdate({
            user,
            "cartItems.product": productId,
            "cartItems.color": color,
            "cartItems.quantity": {$lt: maxQuantity},
        }, {
            $inc: {"cartItems.$.quantity": 1},
        }, {
            new: true, runValidators: true,
        });
    }

    async #addNewCartItem(user, product,price, color) {
        let cart = await this.#Cart.findOneAndUpdate({user},
            {
                $push: {
                    cartItems: {
                        product,
                        color,
                        quantity: 1,
                        price
                    }
                }
            }, {new: true, runValidators: true}
        )

        if (!cart) {
            cart = new Cart({
                user,
                cartItems: [{
                    product,
                    color,
                    quantity: 1,
                    price
                }]
            });
            await cart.save();
        }

        return cart;
    }

    async addToCart(productId, color, user) {
        const product = await Product.findById(productId);
        if (!product) throw new NotFoundError("Product not found");
        if (product.quantity < 1) throw new BadRequestError("Product is out of stock");
        if (!product.colors.includes(color)) throw new BadRequestError(`Invalid color. Available colors: ${product.colors.join(", ")}`);

        let cart = await this.#findAndIncrementCartItem(user, productId, color, product.quantity);
        if (cart) {
            cart.calculateTotals()
            return cart
        }

        cart = await this.#addNewCartItem(user, productId,product.price, color);
        cart.calculateTotals()
        await cart.save()
        return cart;
    }

    async getCartProducts(user) {
        if (!await this.#Cart.exists({user})) throw new NotFoundError("This user doesn't have a cart");

        const cart = await this.#Cart.findOne({user}).setOptions({skipPopulate: true})
            .select("cartItems")
            .populate({
                path: 'cartItems.product', select: "name", options: {skipPopulate: true}
            });
        return cart.cartItems;
    }

    async clearCartItems(user) {

        const cart = await this.#Cart.findOneAndUpdate({user}, {
            $set: {
                cartItems: [], totalCartPrice: 0, totalPriceAfterDiscount: 0
            }
        }, {new: true});
        console.log(cart)

        if (!cart) throw new NotFoundError("This user doesn't have a cart");
        cart.calculateTotals()
        await cart.save()
        return cart;
    }

    async removeProductFromCart(productId, user) {
        const cart = await this.#Cart.findOneAndUpdate({
            user, "cartItems.product": productId
        }, {$pull: {cartItems: {product: productId}}}, {new: true, runValidators: true});

        if (!cart) throw new NotFoundError("this user doesn't have a cart or this product");
        cart.calculateTotals()
        await cart.save();
        return cart;
    }

    async updateProductQuantity(user, quantity, id) {
        const product = await Product.findById(id);

        if (quantity > product.quantity) throw new BadRequestError(`There is only ${product.quantity} in stock of ${product.name}`);

        const cart = await Cart.findOneAndUpdate({
            user, "cartItems.product": id,
        }, {$set: {"cartItems.$.quantity": quantity}}, {new: true, runValidators: true});

        if (!cart) throw new NotFoundError(`This user doesn't have a cart or this product`);

        cart.calculateTotals()
        await cart.save()

        return cart;
    }

    async applyCoupon(name, user) {
        const coupon = await Coupon.findOne({name});
        if (!coupon) throw new NotFoundError("There is no coupon with this name");


        if (coupon.expire < Date.now()) throw new BadRequestError("Sorry, this coupon is expired");


        const cart = await this.#Cart.findOne({user});
        if (!cart) throw new NotFoundError("This user doesn't have a cart");


        if (cart.cartItems.length <= 0) throw new BadRequestError("Sorry, this user doesn't have products in their cart");


        cart.discountPercentage = coupon.discount;
        cart.calculateTotals()

        await cart.save();
        return cart;
    }
}

export default new CartService(Cart);
