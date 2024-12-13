'use strict';

import { MongoCryptCreateEncryptedCollectionError } from 'mongodb';
import shopModel from '../models/shop.model.js';
import bcript from 'bcrypt'
import crypto from 'node:crypto';
import KeyTokenService from './keyToken.service.js';
import createTokenPair from '../authorization/auth.utils.js';
import { getInfoData } from '../utils/index.js'
import { token } from 'morgan';
import { ApiError } from '../handles/error.handle.js';
import { ApiResponse } from '../handles/response.handle.js';
import StatusCode from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandle.js';

const roleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}



const signup = async ({ name, email, password }) => {

    //step 1: check email exists ?
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
        throw new ApiError(StatusCode.BAD_REQUEST, `${name} already exists`);
    }

    //step 2: hash password
    const hashedPassword = await bcript.hash(password, 10);

    //step 3: save user to db
    const newShop = await shopModel.create({
        name, email, password: hashedPassword, roles: [roleShop.SHOP]
    });
    //step 4: create token
    if (newShop) {
        //create private key and public key
        // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        //     modulusLength: 4096,
        //     publicKeyEncoding: { type: 'spki', format: 'pem' },
        //     privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        // })

        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        // save collection key store

        const keyStore = await KeyTokenService.creatseKeyToken({
            userId: (await newShop)._id,
            publicKey,
            privateKey
        })

        if (!keyStore) {
            throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, `Couldn't create key token`)
        }

        // create token pair  
        const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)

        return ( new ApiResponse(StatusCode.OK, {
            shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: newShop }),
            tokens: tokens
        }, `Signup successful!`))

    }

    throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, `Couldn't create user`)
}

const login = async ({ email, password }) => {
    const checkUserExists = await shopModel.findOne({ email }).lean()
    if (!checkUserExists) {
        throw new ApiError(StatusCode.UNAUTHORIZED, 'Invalid email or password')
    }
    const isMatch = await bcript.compare(password, checkUserExists.password)
    if (!isMatch) {
        throw new ApiError(StatusCode.UNAUTHORIZED, 'Invalid email or password')
    }
    //create public key and private key
    const publicKey = await crypto.randomBytes(64).toString('hex')
    const privateKey = await crypto.randomBytes(64).toString('hex')

    // create token pair
    const tokens = await createTokenPair({ userId: checkUserExists._id, email }, publicKey, privateKey)

    return (new ApiResponse(StatusCode.OK, {
        shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: checkUserExists }),
        tokens: tokens
    }, `Login successful!`))

}



export default {
    signup,
    login
};