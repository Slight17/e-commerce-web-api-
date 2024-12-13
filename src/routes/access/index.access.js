'use strict';

import express from 'express';
import accessController from '../../controllers/access.controller.js';
import  {asyncHandler}  from '../../utils/asyncHandle.js';
const router = express.Router();

//signUp routes
router.post('/shop/signup', asyncHandler(accessController.signup));
// signIn routes
router.post('/shop/login', asyncHandler(accessController.login));

export default router