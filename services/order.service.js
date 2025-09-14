import Order from "../models/order.model.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../utils/api-errors.js";
import ApiFeatures from "../utils/api-features.js";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

class OrderService {
  async getAllOrders(query, user = null) {
    let filter = user ? { user } : {};
    const totalOrderCount = await Order.countDocuments(filter);

    if (totalOrderCount === 0) {
      throw new NotFoundError("it seems that user didn't make any orders");
    }

    const apiFeatures = new ApiFeatures(query, Order.find(filter))
      .filter()
      .limitFields()
      .search(Order.modelName)
      .sorting()
      .paginate(totalOrderCount);

    const { mongooseQuery, pagination } = apiFeatures;

    const orders = await mongooseQuery.lean();

    return { orders, pagination };
  }

  async deleteOrder(id) {
    const order = await Order.findById(id).lean();
    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (order.status !== "cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { quantity: item.quantity },
        });
      }
    }

    await Order.findByIdAndDelete(id);
  }

  async getOrder(user, id) {
    const order = await Order.findOne({ user, _id: id }).lean();

    if (!order)
      throw new NotFoundError("it seems that user doesn't have this order");

    return order;
  }

  async createOrder(body, user, url) {
    const { shippingAddress, items } = body;

    let orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new NotFoundError(
          `Product not found with this id: ${item.product}`
        );
      }

      if (product.quantity < item.quantity) {
        throw new BadRequestError(
          `There is only ${product.quantity} in stock of ${product.name}`
        );
      }
      orderItems.push({
        product: item.product,
        price: product.price,
        quantity: item.quantity,
      });

      if (url === "/from-cart") {
        const cart = await Cart.findOne({ user });
        if (cart) {
          cart.cartItems = cart.cartItems.filter(
            (cartItem) =>
              cartItem.product.toString() !== item.product.toString()
          );
          await cart.save();
        }
      }

      product.quantity -= item.quantity;
      await product.save();
    }
    const order = new Order({
      user,
      shippingAddress,
      items: orderItems,
    });

    await order.save();
    return order;
  }

  async updateOrder(body, orderId, user) {
    const allowed = ["shippingAddress", "paymentMethod", "items"];

    for (const field in body) {
      if (!allowed.includes(field)) {
        throw new ForbiddenError(
          `You cann't update this field, allowed fields is ${allowed.join(" ")}`
        );
      }
    }

    const order = await Order.findOneAndUpdate(
      { _id: orderId, user, status: "pending" || "confirmed" },
      { ...body },
      { new: true }
    ).lean();

    if (!order) {
      throw new NotFoundError("Couldn't find this order");
    }

    return order;
  }

  // call it when there is an update on the payment
  async updateOrderStatus(id) {
    const order = await Order.findById(id);

    if (!order) throw new NotFoundError("Couldn't find the order");

    const { paymentMethod, paymentStatus } = order;

    if (paymentMethod === "Card") {
      switch (paymentStatus) {
        case "pending":
          order.status = "pending";
          break;
        case "completed":
          order.status = "confirmed";
          break;
        case "refunded":
          order.status = "refunded";
          break;
        case "failed":
          order.status = "cancelled";
          break;
      }
    } else {
      order.status = paymentStatus === "pending" ? "pending" : "confirmed";
    }

    await order.save();
    return order;
  }
}

export default new OrderService();
