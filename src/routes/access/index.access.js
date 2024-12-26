'use strict';

import express from 'express';
import accessController from '../../controllers/access.controller.js';
import  {asyncHandler}  from '../../utils/asyncHandle.js';
const router = express.Router();
import auth from '../../authorization/auth.utils.js'
//signUp routes
router.post('/shop/signup', asyncHandler(accessController.signup));
// signIn routes
router.post('/shop/login', asyncHandler(accessController.login));

//authenticate to logout routes

router.use(auth.authenticationV2)

router.post('/shop/logout', asyncHandler(accessController.logout));
router.post('/shop/handleRefreshToken', asyncHandler(accessController.handleRefreshToken));
export default router