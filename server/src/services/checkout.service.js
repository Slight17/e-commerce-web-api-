import { StatusCodes } from "http-status-codes";
import { ApiError } from "../handles/error.handle.js";
import cartModel from "../models/cart.model.js"
import cartRepo from "../models/repositories/cart.repo.js"
import productRepo from "../models/repositories/product.repo.js";
import discountService from "./discount.service.js";
import redisService from "../redis/redis.service.js";
import orderModel from "../models/order.model.js";


class CheckoutService {

    //without login
    /*
    {
        cartId,
        userId,
        shop_order_ids: [
            {
                shopId,
                shop_discounts: [
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
        cartId, userId, shop_order_ids = []
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
        for (let i = 0; i < shop_order_ids.length; i++) {
            const {
                shopId,
                shop_discounts = [],
                item_products = [],
            } = shop_order_ids[i];

            const checkProductByServer = await productRepo.checkProductByServer({ products: item_products })

            if (!checkProductByServer[0]) throw new ApiError(StatusCodes.BAD_REQUEST, `Bad request`)


            //tong tien don hang cua mot shop
            const checkOutPrice = checkProductByServer.reduce((acc, cur) => {
                return acc + cur.product_price * cur.quantity
            }, 0)

            //tong tien truoc khi xu li
            checkout_order.totalPrice = + checkOutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkOutPrice,
                priceApplyDiscount: checkOutPrice,
                item_products: checkProductByServer
            }

            if (shop_discounts.length > 0) {
                for (let j = 0; j < shop_discounts.length; j++) {
                    const {
                        discount_id,
                        codeId
                    } = shop_discounts[j]

                    const { discount = 0, totalPrice = 0 } = await discountService.getDiscountAmount({
                        codeId: codeId,
                        userId: userId,
                        shopId: shopId,
                        products: checkProductByServer
                    })

                    checkout_order.totalDiscount += discount

                    if (discount > 0) {
                        itemCheckout.priceApplyDiscount = itemCheckout.priceApplyDiscount - discount
                    }
                }
            }
            //tong thanh toan cuoi cung
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)

        }

        return {
            checkout_order,
            shop_order_ids: shop_order_ids,
            shop_order_ids_new: shop_order_ids_new
        }


    }


    static async ortherByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment = {}

    }){
        const { shop_order_ids_new, checkout_orther} = await this.checkoutService({
            cartId: cartId,
            userId: userId,
            shop_order_ids: shop_order_ids
        })

        //check one more time product is over quantity
        const products = shop_order_ids_new.flatMap(order =>order.item_products) 

        const acquireProduct =  []
        for (const product of products){
            const { productId, quantity } = product
            const keyLock =  await redisService.acquireLock({
                productId: productId,
                quantity: quantity,
                cartId: cartId
            })
            acquireLock.push(keyLock ? true : false)
            if(keyLock){
                await redisService.releaseLock(keyLock)
            }          
        }

        //check if existing product is out of stock 

        if (acquireProduct.includes(false)){
            throw new ApiError(StatusCodes.BAD_REQUEST, 'some product is updated')
        }


        const newOrder =  await orderModel.create({
            order_userId: userId,
            order_checkout: checkout_orther,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        })

        // neu insert thanh cong thi remove product co trong cart
        if(newOrder){

        }
        return newOrder

    }

    //query order [user]
    static async getOrderByUser() {

    }

    //query order using id [user]
    static async getOneOrderByUser() {
        
    }

    //cancel order [user]
    static async cancelOrderByUser() {

    }
    //update order [shop, admin]
    static async updateOrderStatusByShop() {

    }

}

export default CheckoutService