import { StatusCodes } from 'http-status-codes';
import CartServices from '../services/cart.service.js';

class CartController {
    static async addProductToCart(req, res, next) {
            const { userId, cart_products } = req.body;
            const updatedCart = await CartServices.addProductToCart({ userId, cart_products });
            res.status(StatusCodes.CREATED).json({
                message: 'Product added to cart successfully',
                metadata: updatedCart
            });
        
    }

    static async increaseProductQuantity(req, res, next) {
            const { userId, productId } = req.body;
            const updatedCart = await CartServices.increaseProductQuantity({ userId, productId });
            res.status(StatusCodes.OK).json({
                message: 'Product quantity increased successfully',
                metadata: updatedCart
            });
    }

    static async decreaseProductQuantity(req, res, next) {
            const { userId, productId } = req.body;
            const updatedCart = await CartServices.decreaseProductQuantity({ userId, productId });
            res.status(StatusCodes.OK).json({
                message: 'Product quantity decreased successfully',
                metadata: updatedCart
            });
    }

    static async removeProductFromCart(req, res, next) {
            const { userId, productId, cartId} = req.body;
            const updatedCart = await CartServices.removeProductFromCart({ userId, cartId, productId });
            res.status(StatusCodes.OK).json({
                message: 'Product removed from cart successfully',
                metadata: updatedCart
            });

    }
}

export default CartController;