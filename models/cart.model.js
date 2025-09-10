import mongoose, {Schema} from "mongoose";

const CartSchema = new Schema({
    cartItems: [{
        product: {
            type: mongoose.Schema.ObjectId, ref: "Product", required: [true, "Product is required"],
        }, quantity: {
            type: Number, default: 1, min: [1, "Quantity must be at least 1"], validate: {
                validator: Number.isInteger, message: "Quantity must be an integer",
            },
        }, color: {
            type: String, required: [true, "Color is required"], trim: true,
        }, price: {
            type: Number, required: [true, "Price is required"], min: [0, "Price must be positive"],
        },
    },], totalCartPrice: {
        type: Number, default: 0, min: [0, "Total price must be positive"],
    }, totalPriceAfterDiscount: {
        type: Number, min: [0, "Discounted price must be positive"],
    }, discountPercentage: {
        type: Number,
        default: 0,
        min: [0, "Discount percentage cannot be negative"],
        max: [100, "Discount percentage cannot exceed 100"],
    }, user: {
        type: mongoose.Schema.ObjectId, ref: "User", required: [true, "User is required"], unique: true,
    },
}, {timestamps: true});

CartSchema.methods.calculateTotals = function () {
    const items = Array.isArray(this.cartItems) ? this.cartItems : [];

    this.totalCartPrice = items.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0).toFixed(2);

    this.totalPriceAfterDiscount = this.discountPercentage > 0 ? this.totalCartPrice * (1 - this.discountPercentage / 100).toFixed(2) : this.totalCartPrice.toFixed(2);
};

CartSchema.pre("save", function (next) {
    this.calculateTotals();
    next();
});

CartSchema.post([/Update/, /Delete/], async function (doc, next) {
    if (doc) doc.calculateTotals();
    if (doc && (doc.isModified("totalCartPrice") || doc.isModified("totalPriceAfterDiscount"))) await doc.save();
    next();
});

CartSchema.pre(["save", /^find/], function (next) {
    const skipPopulate = this.getOptions().skipPopulate;

    if (skipPopulate) {
        console.log("Skipping populate");
        return next();
    }

    this.populate({
        path: "cartItems.product", select: "name price images colors",
    });
    this.populate({
        path: "user", select: "name email",
    });

    next();
});

export default mongoose.model("Cart", CartSchema);
