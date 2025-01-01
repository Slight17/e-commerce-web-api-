//key 

import mongoose, { model, Schema, Types } from 'mongoose';


const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discounts';

// Declare the Schema of the Mongo model
const discountSchema = new mongoose.Schema({
    discount_name: { type: String, required: true },
    discount_description: { type: String },
    discount_type: { type: String, required: true, enum: ['percentage', 'fixed_amount'] },
    discount_value: { type: Number, required: true },
    discount_max_value: { type: Number },
    discount_code: { type: String, required: true },                //ma khuyen mai
    discount_start_day: { type: Date, required: true },             //ngay bat dau discount
    discount_end_day: { type: Date, required: true },               //ngay het han discount
    discount_max_uses: { type: Number, require: true },             //so luong discount dc ap dung
    discount_user_count: { type: Number, default: 1 },              //so discount da su dung
    discount_user_used: { type: Array, default: [] },               //user da ap dung code discount
    discount_max_used_per_user: { type: Number, require: true },    //so luong cho phep toi da su dung code moi user
    discount_min_order_value: { type: Number, require: true },      //giam gia toi thieu cua don hang
    discount_shopId: { type: Schema.Types.ObjectId, required: true, ref: 'Shop' },
    discount_active: { type: Boolean, required: true },
    discount_applied: { type: String, required: true, enum: ['all', 'specific'] },
    discount_product_ids: { type: Array, default: [] } //so product duoc ap dung
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

await discountSchema.pre('save', function (next) {
    // Kiểm tra xem discount_user_used có thay đổi không
    if (!this.isModified('discount_user_used')) return next();

    // Cập nhật discount_max_uses và discount_user_count
    this.discount_max_uses -= 1; // Giảm số lần sử dụng tối đa
    this.discount_user_count += 1; // Tăng số lần người dùng đã sử dụng

    next();
});

//Export the model
export default mongoose.model(DOCUMENT_NAME, discountSchema)