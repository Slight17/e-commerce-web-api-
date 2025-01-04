import productModel from '../product.model.js'
import { Types } from 'mongoose'
import { ApiError } from '../../handles/error.handle.js'
import { StatusCodes } from 'http-status-codes'
import { getSelectData, unGetSelectData } from '../../utils/index.js'

const queryProduct = async ({ query, limit, skip }) => {
    return await productModel.product.find(query)
        .populate('product_shop', 'name email -_id')
        .limit(limit)
        .skip(skip)
        .sort({ updateAt: -1 })
        .lean()
        .exec()
}

const setPublishedProduct = async ({ product_shop, product_id }) => {
    console.log({ product_shop, product_id })
    const foundShop = await productModel.product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundShop) throw new ApiError(StatusCodes.NOT_FOUND, `Product not found for shop ${product_shop}`)

    foundShop.isDraft = false
    foundShop.isPublished = true
    return foundShop.updateOne(foundShop)

}

const setUnpublishedProduct = async ({ product_shop, product_id }) => {
    const foundShop = await productModel.product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundShop) throw new ApiError(StatusCodes.NOT_FOUND, `Product not found for shop ${product_shop}`)

    foundShop.isDraft = true
    foundShop.isPublished = false
    return foundShop.updateOne(foundShop)
}


const searchProducts = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch, 'i')
    const results = await productModel.product.find(
        {
            $text: { $search: regexSearch }
        },
        {
            score: { $meta: 'textScore' }
        }
    )
        .sort({ score: { $meta: 'textScore' } })
        .lean()
    return results
}

const findAllProducst = async ({ limit = 50, sort, page = 1, fliter, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    
    return await productModel.product.find(fliter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
}

const findProduct = async ({ product_id, unselect}) => {
    return await productModel.product.findById( product_id).select(unGetSelectData(unselect))
}

//update product

const updateProduct = async ({ product_id, objectParams, model, isNew = true }) => {
    console.log(objectParams)
    const updateProduct = await model.findByIdAndUpdate(product_id, objectParams, {new: isNew})
    return updateProduct
}

const findProductById = async ({productId}) => {
    return await productModel.product.findById(new Types.ObjectId(productId))
}




export default {
    queryProduct,
    setPublishedProduct,
    setUnpublishedProduct,
    searchProducts,
    findAllProducst,
    findProduct,
    updateProduct,
    findProductById
}