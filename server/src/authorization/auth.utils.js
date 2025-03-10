'use strict';

import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandle.js';
import { ApiError } from '../handles/error.handle.js';
import { StatusCodes } from 'http-status-codes';
import keyTokenModel from '../models/keytoken.model.js';
import keyTokenService from '../services/keyToken.service.js';
import { Types } from 'mongoose';
import mongoose from 'mongoose';
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
}

const createTokenPair = async (payload, publicKey, privateKey) => {

    try {
        //access token 
        const accessToken = await jwt.sign(payload, publicKey, {
            expiresIn: '2 Days'
        })
        const refreshToken = await jwt.sign(payload, privateKey, {
            expiresIn: '7 Days'
        })

        // jwt.verify( accessToken, publicKey, (err, decode) =>{
        //     if(err){
        //         console.error(err);
        //     }else{
        //         console.log(`decoded: `, decode);         
        //     }
        // })

        return { accessToken, refreshToken };



    } catch (error) {
        return error
    }

}

const authentication = asyncHandler(async (req, res, next) => {
    //check userId missing
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) {
        throw new ApiError(StatusCodes.SERVICE_UNAVAILABLE, 'Unauthenticated')
    }
    //get accessToken
    const obj = await new mongoose.Types.ObjectId(userId)
    console.log(obj)
    const keyStore = await keyTokenService.findByUserId({ userId })
    // console.log(keyStore)
    if (!keyStore) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Dont exist user`)
    }
    //verify accessToken
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized: Access token is required')
    }

    try {
        const isValid = await jwt.verify(accessToken, keyStore.publicKey)
        console.log(isValid)
        if (userId !== isValid.userId) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized: Invalid Userid')
        }
        req.keyStore = keyStore

        return next()
    } catch (error) {
        throw new Error(error.message)
    }

})

const authenticationV2 = asyncHandler(async (req, res, next) => {
    //check userId missing
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) {
        throw new ApiError(StatusCodes.SERVICE_UNAVAILABLE, 'Unauthenticated')
    }
    //get accessToken
    const keyStore = await keyTokenService.findByUserId({ userId })
    // console.log(keyStore)
    if (!keyStore) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Dont exist user`)
    }
    //verify accessToken

    if (req.headers[HEADER.REFRESHTOKEN]) {

        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN]
            const isValid = await jwt.verify(refreshToken, keyStore.privateKey)
            if (userId !== isValid.userId) {
                throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized: Invalid Userid')
            }
            req.keyStore = keyStore
            req.user = isValid
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            throw new Error(error.message)
        }
    }
    
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized: 1ccess token is required')
    }

    try {
        const isValid = await jwt.verify(accessToken, keyStore.publicKey)
        if (userId !== isValid.userId) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized: Invalid Userid')
        }
        req.keyStore = keyStore
        req.user = isValid
        return next()
    } catch (error) {
        throw new Error(error.message)
    }

})

const verifyJWT = async (token, keySecret) => {
    const decode = jwt.verify(token, keySecret)
    console.log(decode)
    return decode;
}

//exporting function  to be used in other files
export default { createTokenPair, authentication, verifyJWT, authenticationV2 };