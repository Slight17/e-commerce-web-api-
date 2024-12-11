//key 
import mongoose, { trusted } from "mongoose";

const DOCUMENT_NAME = 'Apikey';
const COLLECTION_NAME = 'Apikeys';

// Declare the Schema of the Mongo model
const apiKeySchema = new mongoose.Schema({
    key:{
        type:String,
        required:true,
        unique:true, 
    },
    status: {
        type: String,
        default: true
    },
    permission:{
        type: [String],
        required: true,
        enum: ['0000','1111', '2222']
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
export default mongoose.model(DOCUMENT_NAME, apiKeySchema)