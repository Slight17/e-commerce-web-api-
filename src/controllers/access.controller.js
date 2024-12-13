'use strict';

import AccessService from "../services/access.service.js";
import { MongoCryptCreateEncryptedCollectionError } from 'mongodb';
import shopModel from '../models/shop.model.js';
import bcript from 'bcrypt'
import crypto from 'node:crypto';
import KeyTokenService from '../services/keyToken.service.js';
import createTokenPair from '../authorization/auth.utils.js';
import { getInfoData } from '../utils/index.js'
import { token } from 'morgan';
import { ApiError } from '../handles/error.handle.js';
import { ApiResponse } from '../handles/response.handle.js';
import StatusCode from 'http-status-codes';
import { asyncHandler } from '../utils/asyncHandle.js';
import accessService from "../services/access.service.js";

const roleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

const signup = async (req, res, next) => {
    const { name, email, password } = req.body;
    return res.status(StatusCode.CREATED).json(await accessService.signup({ name, email, password }))
}

const login = async (req, res, next) => {
    const { email, password } = req.body;
    return res.status(StatusCode.OK).json(await accessService.login({ email, password }))
}

export default {
    signup,
    login
};