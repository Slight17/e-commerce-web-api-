'use strict';


import mongoose, { model, Schema, Types } from 'mongoose';

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

const keyTokenScheme = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Shop',
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
        refreshTokenUsed:{
            type: Array,
            default: []
        },
        refreshToken:{
            type: String,
            required: true
        }

    },
    {
        timestamps: true,
        collections: COLLECTION_NAME
    }
);
const keyTokenModel =  mongoose.model(DOCUMENT_NAME, keyTokenScheme)
export default  keyTokenModel
