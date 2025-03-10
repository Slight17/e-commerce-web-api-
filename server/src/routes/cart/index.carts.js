import express from 'express';
import CartController from '../../controllers/cart.controller.js';
import auth from '../../authorization/auth.utils.js';
import { asyncHandler } from '../../utils/asyncHandle.js';

const router = express.Router();

router.use(auth.authenticationV2)

router.post('/add', asyncHandler(CartController.addProductToCart));
router.post('/increase', asyncHandler(CartController.increaseProductQuantity));
router.post('/decrease', asyncHandler(CartController.decreaseProductQuantity));
router.post('/delete', asyncHandler(CartController.removeProductFromCart));


export default router;