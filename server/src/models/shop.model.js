'use strict';

import { kMaxLength } from 'buffer';
import mongoose, { model, Schema, Types } from 'mongoose';

const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'Shops';

const shopScheme = new Schema(
    {
        name: {
            type: String,
            trim: true,
            maxLength: 50
        },
        email: {
            type: String,
            unique: true,
            trim: true
        },
        password:{
            type: String,
            minlength: 8    
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        },
        verify: {
            type: Schema.Types.Boolean,
            default: false

        },
        roles:{
            type: Array,
            default: ['user']

        },
        


    },
    {
        timestamps: true,
        collections: COLLECTION_NAME
    }
);

export default  mongoose.model(DOCUMENT_NAME, shopScheme)