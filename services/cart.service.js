import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

export const addToCartService = async (productId, color, user) => {
  const existingProduct = await Product.findById(productId);

  let cart = await getCartProductsService(user);

  if (!cart) {
    cart = await Cart.create({
      cartItems: {
        product: existingProduct,
        color,
        price: existingProduct.price,
      },
      user,
    });
  } else {
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    console.log(productIndex);

    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      cart.cartItems.push({
        product: existingProduct,
        color,
        price: existingProduct.price,
      });
    }
  }
  await cart.save();
  return cart;
};

export const getCartProductsService = async (user) => {
  return await Cart.findOne({ user });
};

export const removeSpecificCartItemService = async (productId, user) => {
  const cart = await Cart.findOne({ user });

  if (!cart) {
    return null;
  }

  const updatedCart = await Cart.findOneAndUpdate(
    {
      user,
    },
    {
      $pull: { cartItems: { product: productId } },
    },
    { new: true }
  );

  await updatedCart.save();

  return updatedCart;
};

export const removeAllFromCartService = async (userId) => {
  const cart = await Cart.findOneAndDelete({ user: userId });
  console.log(cart);

  if (!cart) {
    return null;
  }

  return cart;
};

export const updateCartItemQuantityService = async (user, quantity, id) => {
  let cart = await Cart.findOne({ user });

  if (!cart) {
    return null;
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === id
  );

  if (itemIndex > -1) {
    let cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return null;
  }

  return cart;
};
