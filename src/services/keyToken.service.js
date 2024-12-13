'use strict';


import keyTokenModel from '../models/keytoken.model.js'


class KeyTokenService {

    static createKeyToken = async ({userId, publicKey, privateKey}) => {
        try {
            
            // const token = await keyTokenModel.create({
            //     user: userId,
            //     publicKey: publicKey,
            //     privateKey: privateKey 
            // });
             
            // return token ? token.publicKey : null;
            const filters = {user: userId}
            const update = {
                publicKey: publicKey,
                privateKey: privateKey
            }
            const options = { upsert: true, new: true }
            const tokens = await keyTokenModel.findOneAndUpdate(filters, update, options)
            
            return tokens ? token.publicKey : null;
        } catch (error) {
            return error
        }
    }

}

export default KeyTokenService