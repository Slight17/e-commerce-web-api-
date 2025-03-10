//key 

import mongoose, { model, Schema, Types } from 'mongoose';


const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

// Declare the Schema of the Mongo model
const inventorySchema = new mongoose.Schema({
    inven_productId:{
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    inven_location:{
        type: String,
        default: 'Unknown',
        required: true
    },
    inven_stock:{
        type: Number,
        required: true
    },
    inven_shopId:{
        type: Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    inven_revervations:{
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
export default mongoose.model(DOCUMENT_NAME, inventorySchema)