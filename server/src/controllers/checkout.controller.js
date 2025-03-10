import { StatusCodes } from 'http-status-codes';
import CheckoutService from '../services/checkout.service.js';

class CheckoutController {

    static async checkoutProduct(req, res, next) {
        const { cartId, shop_order_ids = [] } = req.body;
        const checkoutResult = await CheckoutService.checkoutService({
            cartId, 
            userId: req.user.userId,
            shop_order_ids
        });
        res.status(StatusCodes.OK).json({
            message: 'Product checkout successfully',
            metadata: checkoutResult
        });
    }

}

export default CheckoutController;