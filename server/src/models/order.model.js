//key 

import mongoose, { model, Schema, Types } from 'mongoose';


const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

// Declare the Schema of the Mongo model
const orderSchema = new mongoose.Schema({
    order_userId: { type: Types.ObjectId, required: true },
    order_checkout: {type: Object, default: {}},
    order_shipping: {type: Object, default: {}},
    order_payment: {type: Object, default: {}},
    order_products: {type: Array, default: [], required: true},
    order_tracking:{type: String, },
    order_status: {type: String, enum: ['pending', 'completed', 'failed', 'confirmed', 'shipper'], default: 'pending'},
    
}, {
    timestamps: true,
    timeseries:{
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    },
    collection: COLLECTION_NAME
});


//Export the model
export default mongoose.model(DOCUMENT_NAME, orderSchema)