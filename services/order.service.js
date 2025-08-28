import Order from "../models/order.model.js";
import { NotFoundError } from "../utils/ApiErrors.js";
import ApiFeatures from "../utils/apiFeatures.js";

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
    const order = await Order.findByIdAndDelete(id, { new: true });
    console.log(order);
    if (!order) {
      throw new NotFoundError("Order not found");
    }
  }

  async getOrder(user, id) {
    const order = await Order.findOne({ user, _id: id });

    if (!order)
      throw new NotFoundError("it seems that user doesn't have this order");

    return order;
  }

  async createOrder(body, user) {
    const { shippingAddress, cart, paymentMethod = "COD" , totalOrderPrice = 200, shippingPrice} = body;
    
    const order = new Order({
      user,
      shippingAddress,
      cart,
      shippingPrice,
      totalOrderPrice,
      paymentMethod,
    });
    
    await order.save();
    return order;
  }
}

export default new OrderService();
