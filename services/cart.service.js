import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import { BadRequestError, NotFoundError } from "../utils/ApiErrors.js";
import Coupon from "../models/coupon.model.js";

export const addToCartService = async (productId, color, user) => {
  const existingProduct = await Product.findById(productId);

  if (!existingProduct) {
    throw new NotFoundError("Product not found");
  }
  if (existingProduct.quantity < 1) {
    throw new BadRequestError("Product is out of stock");
  }

  let cart = await getCartProductsService(user);

  if (!cart) {
    cart = await Cart.create({
      cartItems: [
        {
          product: existingProduct,
          color,
          price: existingProduct.price,
        },
      ],
      user,
    });
  } else {
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );

    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      if (cartItem.quantity >= existingProduct.quantity) {
        throw new BadRequestError("Cannot add more items. Insufficient stock");
      }
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      cart.cartItems.push({
        product: existingProduct,
        color,
        price: existingProduct.price,
      });
    }
    await cart.save();
  }
  await cart.populate("cartItems.product", "name price images colors");
  return cart;
};

export const getCartProductsService = async (user) => {
  return await Cart.findOne({ user }).populate(
    "cartItems.product",
    "name price images colors"
  );
};

export const removeSpecificCartItemService = async (productId, user) => {
  const cart = await Cart.findOne({ user });

  if (!cart) {
    throw new NotFoundError("this user doesn't have cart");
  }

  cart.cartItems = cart.cartItems.filter(
    (item) => item.product.toString() !== productId
  );

  await cart.save();
  await cart.populate("cartItems.product", "name price images colors");
  return cart;
};

export const removeAllFromCartService = async (userId) => {
  const cart = await Cart.findOneAndDelete({ user: userId });

  if (!cart) {
    throw new NotFoundError("this user doesn't have cart");
  }

  return cart;
};

// TODO("valdiate product and quantity")
export const updateCartItemQuantityService = async (user, quantity, id) => {
  let cart = await Cart.findOne({ user });

  if (!cart) {
    throw new NotFoundError(`this cart doesn't have this product`);
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item.product.toString() === id
  );

  if (itemIndex > -1) {
    cart.cartItems[itemIndex].quantity = quantity;
    await cart.save();
  } else {
    return null;
  }

  return cart;
};

export const applyCouponService = async (name, user) => {
  const coupon = await Coupon.findOne({ name });
  if (!coupon) {
    throw new NotFoundError("There is no coupon with this name");
  }

  if (coupon.expire < Date.now()) {
    throw new BadRequestError("Sorry, this coupon is expired");
  }

  const cart = await Cart.findOne({ user });
  if (!cart) {
    throw new NotFoundError("This user doesn't have a cart");
  }

  if (cart.cartItems.length <= 0) {
    throw new BadRequestError(
      "Sorry, this user doesn't have products in their cart"
    );
  }

  const discountAmount = (cart.totalCartPrice * coupon.discount) / 100;
  cart.totalPriceAfterDiscount = (cart.totalCartPrice - discountAmount).toFixed(
    2
  );

  await cart.save();
  return cart;
};
