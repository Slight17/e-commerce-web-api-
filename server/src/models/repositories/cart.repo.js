import productModel from "../product.model.js"
import { ApiError } from "../../handles/error.handle.js"
import { StatusCodes } from "http-status-codes"
import cartModel from "../cart.model.js"
import { Types } from "mongoose"


const checkQuantiyProductByAddCart = async ({ productId, newQuantity }) => {
    const product = await productModel.product.findById(productId)
    const cart = await cartModel.findOne({ cart_userId })
    const quantity = product.quantity
    if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
    if (product.product_quantity < newQuantity) throw new ApiError(StatusCodes.BAD_REQUEST, 'Not enough product in stock')
    return true  // return true if enough product in stock, else throw error.
}

const findCartById = async (cartId) => {
    return cartModel.findOne({_id: new Types.ObjectId(cartId), cart_state: 'active'})
}

export default {
    checkQuantiyProductByAddCart,
    findCartById
}