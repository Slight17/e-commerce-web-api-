

/*
    Discount services

    1 -- Generate Discount Code (admin, shop)
    2 -- Get Discount Code (User)
    3 -- Get All Discount Code (User, Shop)
    4 -- verify Discount Code (User)
    5 -- Delete Discount Code (Shop, Admin)
    6 -- Cancel Discount Code (user)
*/

import { StatusCodes } from "http-status-codes";
import { ApiError } from "../handles/error.handle.js";
import discountModel from "../models/discount.model.js";
import { Types } from "mongoose";
import DiscountRepo from "../models/repositories/discount.repo.js";
import productRepo from "../models/repositories/product.repo.js";

class DiscountServices {
    static async createDiscountCode(payload) {
        const {
            discount_name, discount_description, discount_type, discount_max_value,
            discount_value, discount_code, discount_start_day, discount_end_day,
            discount_max_uses, discount_user_count, discount_user_used, discount_max_used_per_user,
            discount_min_order_value, discount_shopId, discount_active, discount_applied, discount_product_ids
        } = payload;
        if (new Date() < new Date(discount_start_day) || new Date() > new Date(discount_end_day)) {
            throw new ApiError(StatusCodes.BAD_REQUEST, `Discount code expried`)
        }
        if (new Date(discount_start_day) >= new Date(discount_end_day)) {
            throw new ApiError(StatusCodes.BAD_REQUEST, `Start date should be before end date`)
        }
        //create index discount 
        const foundDisc = await discountModel.findOne({
            discount_code: discount_code,
            shop_id: new Types.ObjectId(discount_shopId),
        }).lean();

        if (foundDisc && foundDisc.discount_active == true) {
            throw new ApiError(StatusCodes.CONFLICT, `Discount code already exists`)
        }

        const newDiscount = await discountModel.create({
            discount_name,
            discount_description,
            discount_type,
            discount_value,
            discount_max_value,
            discount_code,
            discount_start_day: new Date(discount_start_day),
            discount_end_day: new Date(discount_end_day),
            discount_max_uses,
            discount_user_count,
            discount_user_used,
            discount_max_used_per_user,
            discount_min_order_value: discount_min_order_value || 0,
            discount_shopId,
            discount_active,
            discount_applied,
            discount_product_ids: discount_applied === 'all' ? [] : discount_product_ids
        })

        return newDiscount
    }


    static async updateDiscount() {

    }


    //get all discount codes available with products
    static async getAllDiscountCodes({ code, shopId, userId, limit, page }) {
        const foundDiscount = await DiscountRepo.findDiscountByCode({
            model: discountModel,
            filter: {
                discount_code: code,
                discount_shopId: new Types.ObjectId(shopId)
            }
        })

        if (!foundDiscount || !foundDiscount.discount_active) {
            throw new ApiError(StatusCodes.NOT_FOUND, `Discount code not found`)
        }

        const { discount_applied, discount_product_ids } = foundDiscount
        console.log(discount_applied, discount_product_ids)
        let products

        if (discount_applied === 'specific') {
            //get the product ids
            const fliter = {
                _id: { $in: discount_product_ids },
                isPublished: true
            }
            products = await productRepo.findAllProducst({
                fliter,
                limit: +limit,
                page: +page,
                select: ['product_name'],
                sort: 'ctime'
            },)
        }

        if (discount_applied === 'all') {
            //get all discount codes available
            const fliter = {
                product_shop: new Types.ObjectId(shopId),
                isPublished: true
            }
            products = await productRepo.findAllProducst({
                fliter,
                limit: +limit,
                page: +page,
                select: ['product_name'],
                sort: 'ctime'
            },)
        }


        return products
    }

    // get all discount codes available of shop

    static async getAllDiscountCodeWithProduct({ limit, page, shopId }) {
        const discounts = DiscountRepo.findAllDiscountsCodeSelect({
            fliter: {
                discount_shopId: new Types.ObjectId(shopId),
                discount_active: true
            },
            limit: +limit,
            page: +page,
            model: discountModel,
            select: ['discount_name', 'discount_code', 'discount_description']
        })

        return discounts
    }

    //apply discount codes to products

    static async getDiscountAmount({ codeId, userId, shopId, products }) {
        const foundDiscount = await DiscountRepo.findDiscountByCode({
            model: discountModel,
            filter: {
                discount_code: codeId,
                discount_shopId: new Types.ObjectId(shopId),
            }
        })

        if (!foundDiscount) {
            throw new ApiError(StatusCodes.NOT_FOUND, `Discount code not found`)
        }

        const {
            discount_active, discount_max_uses, discount_product_ids
        } = foundDiscount

        if (!discount_active) {
            throw new ApiError(StatusCodes.BAD_REQUEST, `discount expired`)
        }

        if (!discount_max_uses) throw new ApiError(StatusCodes.BAD_REQUEST, `discount out`)

        if (new Date() < new Date(foundDiscount.discount_start_day) || new Date() > new Date(foundDiscount.discount_end_day))
            throw new ApiError(StatusCodes.BAD_REQUEST, `Discount code expried`)

        if (foundDiscount.discount_type === 'specific') {
            for (const product of products) {
                if (!foundDiscount.discount_product_ids.includes(product.product_id)) {
                    throw new ApiError(StatusCodes.BAD_REQUEST, `Product with id ${product.product_id} not found`)
                }
            }
        }

        let totalOrder = 0

        if (foundDiscount.discount_min_order_value > 0) {
            //get total
            totalOrder = products.reduce((acc, curr) => acc + curr.product_price * curr.quantity, 0)
            console.log(`Total order for ${totalOrder}`)
            if (totalOrder < foundDiscount.discount_min_order_value)
                throw new ApiError(StatusCodes.BAD_REQUEST, `Minimum order value not met`)
        }

        if (foundDiscount.discount_max_used_per_user > 0) {
            const userUsedDiscount = foundDiscount.discount_user_used.find(user => user.userId === userId)
            if (userUsedDiscount && userUsedDiscount.count >= foundDiscount.discount_max_used_per_user) {
                throw new ApiError(StatusCodes.BAD_REQUEST, `User has used maximum allowed discount`)
            }

            //test add user used discount codes into discount_user_used

            // await discountModel.findByIdAndUpdate(
            //     foundDiscount._id,
            //     {
            //         $push: { discount_user_used: userId },

            //         $inc: {
            //             discount_user_count: 1,
            //             discount_max_uses: -1
            //         }
            //     }
            // );
        }
        let amount = 0
        if (foundDiscount.discount_type === 'fixed_amount') { amount = foundDiscount.discount_value }
        else {
            amount = totalOrder * (foundDiscount.discount_value / 100)
            if (amount > foundDiscount.discount_max_value) { amount = foundDiscount.discount_max_value }
        }
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }


    }

    static async deleteDiscountCodes({ shopId, codeId }) {
        const deletedDiscount = await discountModel.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: new Types.ObjectId(shopId),
        })

        return deletedDiscount
    }

    static async cancelDiscountCode({ shopId, codeId, userId }) {
        const foundDiscount = await DiscountRepo.findDiscountByCode({
            model: discountModel,
            filter: {
                discount_code: codeId,
                discount_shopId: new Types.ObjectId(shopId)
            }
        })

        console.log(foundDiscount)

        if (!foundDiscount) throw new ApiError(StatusCodes.BAD_REQUEST, `Discount code not found`)
        if (!foundDiscount.discount_user_used.includes(userId)) {
            throw new ApiError(StatusCodes.BAD_REQUEST, `User not found in the discount code`)
        }
        const results = await discountModel.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_user_used: userId,
            },
            $inc: {
                discount_user_count: -1,
                discount_max_uses: 1
            }
        }
        )
        return await DiscountRepo.findDiscountByCode({
            model: discountModel,
            filter: {
                discount_code: codeId,
                discount_shopId: new Types.ObjectId(shopId)
            }
        })

    }
}

export default DiscountServices;