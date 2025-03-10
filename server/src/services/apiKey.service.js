import apiKeyModel from "../models/apiKey.model.js";
import crypto from 'crypto';

const findById = async (key) => {
    // Generate a new API key if it doesn't exist yet
    // const newKey = await apiKeyModel.create({
    //     key: crypto.randomBytes(64).toString('hex'),
    //     permission: ['0000']
    // })
    // console.log(newKey);
    const obj = await apiKeyModel.findOne({ key, status: 'true' }).lean();

    return obj;

}



export default {findById} ;    