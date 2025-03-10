import express from 'express';
import CheckoutController from '../../controllers/checkout.controller.js';
import auth from '../../authorization/auth.utils.js';
import { asyncHandler } from '../../utils/asyncHandle.js';

const router = express.Router();

router.use(auth.authenticationV2)
router.post('/', asyncHandler(CheckoutController.checkoutProduct));


export default router;