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
}

export default new OrderService();
