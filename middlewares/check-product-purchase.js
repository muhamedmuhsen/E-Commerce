import Order from "../models/order.model.js";
import { ForbiddenError } from "../utils/api-errors.js";

/**
 * Middleware to verify that a user has purchased a product before allowing them to review it
 * This ensures review integrity by only allowing verified purchasers to leave reviews
 */
const checkProductPurchase = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;

    // Check if user has an order containing this product
    const order = await Order.findOne({
      user: userId,
      "items.product": productId,
      status: { $in: ["delivered", "confirmed", "shipped"] }, // Only valid order statuses
    }).lean();

    if (!order) {
      throw new ForbiddenError(
        "You can only review products you have purchased"
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default checkProductPurchase;
