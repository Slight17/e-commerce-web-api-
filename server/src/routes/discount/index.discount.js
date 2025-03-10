'use strict';

import express from 'express';
import productController from '../../controllers/product.controller.js';
import { asyncHandler } from '../../utils/asyncHandle.js';
const router = express.Router();
import auth from '../../authorization/auth.utils.js'
import discountController from '../../controllers/discount.controller.js';





router.post('/amount', asyncHandler(discountController.getDiscountAmount));
router.get('/list_product_codes', asyncHandler(discountController.getAllDiscountCodes))



//authentication
router.use(auth.authenticationV2)

//route post product 
router.post('/', asyncHandler(discountController.createDiscountCode))
router.get('/', asyncHandler(discountController.getAllDiscountCodeWithProduct))
router.delete('/', asyncHandler(discountController.deleteDiscountCodes))
router.post('/cancel', asyncHandler(discountController.cancelDiscountCode))



export default router