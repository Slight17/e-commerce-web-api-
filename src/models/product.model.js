import mongoose, { Schema, trusted } from "mongoose";
import slugify from "slugify";
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

// Declare the Schema of the Mongo model

const productSchema = new mongoose.Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: 'string' },
    product_slug: { type: String },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_types: { type: String, required: true, enum: ['Electronic', 'Clothing', 'Furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_rating: {
        type: Number,
        min: [1, 'Rating must be above or equal to 1'],
        max: [5, 'Rating must be under or equal to 5'],
        set: (val) => {
            Math.round(val * 10) / 10
        }
    },
    product_varidations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },

},
    {
        collection: COLLECTION_NAME,
        timestamps: true
    }
)

//create index for  search
await productSchema.index({product_name: 'text',  product_description: 'text'})


//document middleware run before .save() and .create

await productSchema.pre('save', function (next) {
    if (!this.isModified('product_name')) return next();

    this.product_slug = slugify(this.product_name, { lower: true });
    next();
});

const clothingSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    material: { type: String },
    size: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
},
    {
        collection: 'clothes',
        timestamps: true
    })

const electronicSchema = new mongoose.Schema({
    manufacturer: { type: String, required: true },
    model: { type: String },
    color: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
},
    {
        collection: 'electronics',
        timestamps: true
    })

const furnitureSchema = new mongoose.Schema({
    manufacturer: { type: String, required: true },
    model: { type: String },
    color: { type: String },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
},
    {
        collection: 'furnitures',
        timestamps: true
    })

export default {
    product: mongoose.model(DOCUMENT_NAME, productSchema),
    clothing: mongoose.model('Clothing', clothingSchema),
    electronics: mongoose.model('Electronics', electronicSchema),
    furniture: mongoose.model('Furnitures', furnitureSchema)
}