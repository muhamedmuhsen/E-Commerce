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

    this.totalCartPrice = items.reduce((sum, item) => {
        const itemTotal = (item.price || 0) * (item.quantity || 0);
        return sum + itemTotal;
    }, 0);
    this.totalCartPrice = Math.round(this.totalCartPrice * 100) / 100
    console.log(this.totalCartPrice)

    if (this.discountPercentage > 0) {
        this.totalPriceAfterDiscount = this.totalCartPrice * (1 - this.discountPercentage / 100);
        this.totalPriceAfterDiscount = Math.round(this.totalPriceAfterDiscount * 100) / 100;
    } else {
        this.totalPriceAfterDiscount = this.totalCartPrice;
    }
    console.log(this)
    return this;
};

CartSchema.pre(/^find/, function (next) {
    if (this.getOptions().skipPopulate) return next();

    this.populate({
        path: "cartItems.product",
        select: "name price images colors",
    }).populate({
        path: "user",
        select: "name email",
    });

    next();
});

export default mongoose.model("Cart", CartSchema);
