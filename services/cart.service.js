import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import { BadRequestError, NotFoundError } from "../utils/api-errors.js";
import Coupon from "../models/coupon.model.js";

class CartService {


  async addToCart(productId, color, user) {
    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      throw new NotFoundError("Product not found");
    }
    if (existingProduct.quantity < 1) {
      throw new BadRequestError("Product is out of stock");
    }

    let cart = await Cart.findOneAndUpdate(
      {
        user,
        "cartItems.product": productId,
        "cartItems.color": color,
        "cartItems.quantity": { $lt: existingProduct.quantity },
      },
      {
        $inc: { "cartItems.$.quantity": 1 },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (cart) return cart;

    cart = await Cart.findOneAndUpdate(
      { user },
      {
        $push: {
          cartItems: {
            product: existingProduct,
            color,
            quantity: 1,
            price: existingProduct.price,
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (cart) return cart;

    cart = new Cart({
      user,
      cartItems: {
        product: existingProduct,
        color,
        quantity: 1,
        price: existingProduct.price,
      },
    });
    await cart.save();

    return cart;
  }

  async getCartProducts(user) {

    if (!await Cart.exists({user})) throw new BadRequestError("This user doesn't have cart");

    console.log(cart.cartItems.length);

    return  await Cart.findOne({ user }).lean().cartItems;
  }

  async removeAllFromCart(user) {
    const cart = await Cart.findOneAndUpdate(
      { user },
      { $set: { cartItems: [] } },
      { new: true }
    );

    if (!cart) throw new NotFoundError("This user doesn't have a cart");

    return cart;
  }

  async removeProductFromCart(productId, user) {
    const cart = await Cart.findOneAndUpdate(
      { user, "cartItems.product": productId },
      { $pull: { cartItems: { product: productId } } },
      { new: true }
    );

    if (!cart) throw new NotFoundError("this user doesn't have a cart or this product");

    return cart;
  }

  async updateProductQuantity(user, quantity, id) {
    const product = await Product.findById(id);

    if (quantity > product.quantity) throw new BadRequestError(`There is only ${product.quantity} in stock of ${product.name}`);

    const cart = await Cart.findOneAndUpdate(
      {
        user,
        "cartItems.product": id,
      },
      { $set: { "cartItems.$.quantity": quantity } },
      { new: true, runValidators: true }
    );

    if (!cart) throw new NotFoundError(`This user doesn't have a cart or this product`);

    return cart;
  }

  async applyCoupon(name, user) {
    const coupon = await Coupon.findOne({ name });
    if (!coupon) throw new NotFoundError("There is no coupon with this name");


    if (coupon.expire < Date.now()) throw new BadRequestError("Sorry, this coupon is expired");


    const cart = await Cart.findOne({ user });
    if (!cart) throw new NotFoundError("This user doesn't have a cart");


    if (cart.cartItems.length <= 0) throw new BadRequestError("Sorry, this user doesn't have products in their cart");


    cart.discountPercentage = coupon.discount;

    await cart.save();
    return cart;
  }
}

export default new CartService();
