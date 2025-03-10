'use strict';

import express from 'express';
import productController from '../../controllers/product.controller.js';
import  {asyncHandler}  from '../../utils/asyncHandle.js';
const router = express.Router();
import auth from '../../authorization/auth.utils.js'



router.get('/search/:keySearch', asyncHandler(productController.getListSearchProducts))
router.get('/:product_id', asyncHandler(productController.findProduct))
router.get('', asyncHandler(productController.findAllProducts))


//authentication
router.use(auth.authenticationV2)

//route post product 
router.post('/', asyncHandler(productController.createNewProduct))
router.post('/set/published/:id', asyncHandler(productController.postPublishProduct))
router.post('/set/unpublished/:id', asyncHandler(productController.postUnpublishProduct))
//route get product
router.get('/draft/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishForShop))
//
router.patch('/:productId', asyncHandler(productController.updateProduct))
export default router