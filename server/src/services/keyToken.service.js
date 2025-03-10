'use strict';
import { Types } from 'mongoose';
import mongoose from 'mongoose';
import keyTokenModel from '../models/keytoken.model.js';



const createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {

        // const token = await keyTokenModel.create({
        //     user: userId,
        //     publicKey: publicKey,
        //     privateKey: privateKey 
        // });
        // return token ? token.publicKey : null;
        const filters = { user: userId }
        const update = {
            publicKey,
            privateKey,
            refeshTokenUsed: [],
            refreshToken
        }
        const options = { upsert: true, new: true }
        const tokens = await keyTokenModel.findOneAndUpdate(filters, update, options)

        return tokens ? token.publicKey : null;
    } catch (error) {
        return error
    }
}

const findByUserId = async ({ userId }) => {
    return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) });
}

const deleteKeyById = async ({ id }) => {
    return await keyTokenModel.deleteOne({ _id: new Types.ObjectId(id) }).lean();

}

const findRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshTokenUsed: refreshToken }).lean();
}
const findRefreshToken = async (refreshToken) => {

    return await keyTokenModel.findOne( {refreshToken} );
}

const deleteKeyByUserId = async (userId) => {
    return await keyTokenModel.findByIdAndDelete(userId).lean();
}
export default {
    createKeyToken,
    findByUserId,
    deleteKeyById,
    findRefreshToken,
    deleteKeyByUserId,
    findRefreshTokenUsed
}