'use strict';

import { MongoCryptCreateEncryptedCollectionError } from 'mongodb';
import shopModel from '../models/shop.model.js';
import bcript from 'bcrypt'
import crypto from 'node:crypto';
import KeyTokenService from './keyToken.service.js';
import createTokenPair from '../authorization/auth.utils.js';
import {getInfoData} from '../utils/index.js'
import { token } from 'morgan';

const roleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    static signup = async ({ name, email, password }) => {
        try {
            //step 1: check email exists ?
            const holderShop = await shopModel.findOne({ email }).lean();
            if (holderShop) {
                return {
                    code: '001',
                    message: 'Email already exists',
                    status: 'error'
                }
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
                const publicKey  = crypto.randomBytes(64).toString('hex');

                // save collection key store

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: (await newShop)._id,
                    publicKey,
                    privateKey
                })

                if (!keyStore) {
                    return {
                        code: '002',
                        message: 'Failed to create key token',
                        status: 'error'
                    }
                }


                // create token pair  
                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)

                console.log(`created token successfully`, tokens)

                return {
                    code: '000',
                    message: 'Signup successfully',
                    status: 'success',
                    metadata: {
                        shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: newShop }),
                        tokens: tokens
                    }

                }
            }

            return {
                code: '003',
                message: 'Failed to create new user',
                status: 'error'
            }



        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }

}

export default AccessService;