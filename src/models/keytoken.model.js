'use strict';


import mongoose, { model, Schema, Types } from 'mongoose';

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

const keyTokenScheme = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Shop'
        },
        privateKey:{
            type: String,
            required: true
        }
        ,
        publicKey: {
            type: String,
            required: true
        },
        refeshToken:{
            type: Array,
            default: []
        }

    },
    {
        timestamps: true,
        collections: COLLECTION_NAME
    }
);

export default  mongoose.model(DOCUMENT_NAME, keyTokenScheme)