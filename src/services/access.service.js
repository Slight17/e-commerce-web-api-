'use strict';

import shopModel from '../models/shop.model.js';
import bcript from 'bcrypt'
import crypto from 'node:crypto';
import KeyTokenService from './keyToken.service.js';
import auth from '../authorization/auth.utils.js';
import { getInfoData } from '../utils/index.js'
import { token } from 'morgan';
import { ApiError } from '../handles/error.handle.js';
import { ApiResponse } from '../handles/response.handle.js';
import StatusCode, { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandle.js';
import shopService from '../services/shop.service.js'
import keyTokenService from './keyToken.service.js';
import keyTokenModel from '../models/keytoken.model.js';

const roleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}



const signup = async ({ name, email, password }) => {

    //step 1: check email exists ?
    const holderShop = await shopService.findByEmail(email);
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

        const tokens = await auth.createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)

        const keyStore = await keyTokenService.createKeyToken({
            userId: (await newShop)._id,
            publicKey,
            privateKey,
            refeshToken: token.refeshToken

        })

        if (!keyStore) {
            throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, `Couldn't create key token`)
        }

        return (new ApiResponse(StatusCode.OK, {
            shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: newShop }),
            tokens: tokens
        }, `Signup successful!`))

    }

    throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, `Couldn't create user`)
}

const login = async ({ email, password, refeshToken = null }) => {

    const checkUserExists = await shopService.findByEmail({ email })
    if (!checkUserExists) {
        throw new ApiError(StatusCode.UNAUTHORIZED, 'Invalid email or password 1')
    }
    const isMatch = await bcript.compare(password, checkUserExists.password)
    if (!isMatch) {
        throw new ApiError(StatusCode.UNAUTHORIZED, 'Invalid email or password')
    }
    //create public key and private key
    const publicKey = await crypto.randomBytes(64).toString('hex')
    const privateKey = await crypto.randomBytes(64).toString('hex')
    // create token pair
    const tokens = await auth.createTokenPair({ userId: checkUserExists._id, email }, publicKey, privateKey)

    const keyStore = await keyTokenService.createKeyToken({
        refreshToken: tokens.refreshToken,
        userId: (await checkUserExists)._id,
        publicKey,
        privateKey,


    })
    if (!keyStore) {
        throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, `Couldn't create key token`)
    }

    return (new ApiResponse(StatusCode.OK, {
        shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: checkUserExists }),
        tokens: tokens
    }, `Login successful!`))

}

const logout = async ({ keyStore }) => {
    const delKey = await keyTokenService.deleteKeyById(keyStore._id)
    if (!delKey) {
        throw new ApiError(StatusCode.INTERNAL_SERVER_ERROR, `Couldn't delete key`)
    }
    return (new ApiResponse(StatusCode.OK, {}, `Logout successful!`))
}

const handleRefreshToken = async (refreshToken) => {
    //check token is used
    const isUsed = await keyTokenService.findRefreshTokenUsed(refreshToken)
    if (isUsed) {
        //decode refresh token
        const { userId, email } = await auth.verifyJWT(refreshToken, isUsed.privateKey)
        console.log({ userId, email })
        //delete this refresh token from the model
        await keyTokenService.deleteKeyById(isUsed._id)
        //return error
        throw new ApiError(StatusCodes.FORBIDDEN, `something went wrong || please try relogin`)
    }

    //if refresh token isn't used then check it in model 
    const holderToken = await keyTokenService.findRefreshToken(refreshToken)
    //if null throw shop not registered
    if (!holderToken) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Shop not registered 1')
    }
    console.log(holderToken.privateKey)
    //else verify token
    const { userId, email } = await auth.verifyJWT(refreshToken, holderToken.privateKey)
    console.log(`[2]--${userId, email}`)
    //check userId
    const foundShop = await shopService.findByEmail({ email });
    if (!foundShop) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Shop not registeted 2')
    }
    // if found shop generate new token
    const token = await auth.createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)

    console.log(token)
    const updatedDoc = await keyTokenModel.updateOne(
        { _id: holderToken._id }, // Điều kiện để tìm document
        {
            $set: { refreshToken: token.refreshToken }, // Cập nhật refreshToken
            $addToSet: { refreshTokenUsed: refreshToken }, // Thêm vào mảng
        }
    );
    
    console.log('Updated document:', updatedDoc);
    return {
        user: { userId, email },
        token
    }

}

const handleRefreshTokenV2 = async ({refreshToken, user, keyStore}) => {
    //check token is used
    const {userId, email} = user

    if(keyStore.refreshTokenUsed.includes(refreshToken)){
        //delete this refresh token from the model
        await keyTokenService.deleteKeyById(userId)
        //return error
        throw new ApiError(StatusCodes.FORBIDDEN, `something went wrong || please try relogin`)
    }

    if(keyStore.refreshToken !== refreshToken){
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Shop not registered 1')
    }

    const foundShop = await shopService.findByEmail({ email });
    if (!foundShop) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Shop not registeted 2')
    }
    // if found shop generate new token
    const token = await auth.createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)
    const updatedDoc = await keyTokenModel.updateOne(
        { _id: keyStore._id }, // Điều kiện để tìm document
        {
            $set: { refreshToken: token.refreshToken }, // Cập nhật refreshToken
            $addToSet: { refreshTokenUsed: refreshToken }, // Thêm vào mảng
        }
    );
    
    console.log('Updated document:', updatedDoc);
    return {
        user,
        token
    }
    


}
export default {
    signup,
    login,
    logout,
    handleRefreshToken,
    handleRefreshTokenV2
};