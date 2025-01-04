import cartModel from "../models/cart.model.js"
import cartRepo from "../models/repositories/cart.repo.js"

class CheckoutService {

    //without login
    /*
    {
        cartId,
        userId,
        shop_order_ids: [
            {
                shopId,
                shop_discount: [
                    {
                        shopId,
                        discount_id,
                        codeId
                    }
                ],
                item_products: {
                    productId,
                    quantity,
                    price
                }
                
            },...
        ]
        
    }
    */
    static async checkoutService({
        cartId, userId, shop_order_ids
    }) {
        //check cartId
        const foundCart = await cartRepo.findCartById(cartId)
        if (!foundCart) throw new ApiError(StatusCodes.NOT_FOUND, 'Cart not found')

        const checkout_order = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0,
        }, shop_order_ids_new = [];

        //checkout_order_ids
        for (const shop_order of shop_order_ids) {
            //check shopId
            const foundShopOrder = foundCart.shop_order_ids.find(shop => shop.shopId === shop_order.shopId)
            if (!foundShopOrder) throw new ApiError(StatusCodes.NOT_FOUND, `Shop order not found for shop ${shop_order.shopId}`)

            checkout_order.totalPrice += shop_order.item_products.reduce((total, item) => total + item.price * item.quantity, 0)
            checkout_order.totalDiscount += shop_order.shop_discount.reduce((total, discount) => total + discount.discount_amount, 0)
            checkout_order.totalCheckout += shop_order.item_products.reduce((total, item) => total + item.price * item.quantity - (item.price * item.quantity * discount.discount_amount / 100), 0)
            //update shop_order_ids in cart
            foundShopOrder.item_products = shop_order.item_products
            foundShopOrder.shop_discount = shop_order.shop_discount
            await cartRepo.updateCart(cartId, foundCart)
        }


    }

}

export default CheckoutService