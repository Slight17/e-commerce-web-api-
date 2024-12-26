import { StatusCodes } from 'http-status-codes'
import productService from '../services/product.service.js'

const createNewProduct = async (req, res, next) => {
    return res.status(StatusCodes.CREATED).json({
        message: 'created product successfully',
        metadata: await productService.createProduct(
            req.body.product_types,
            {
                ...req.body,
                product_shop: req.user.userId
            }
        )
    })
}

const getAllDraftsForShop = async (req, res, next) => {
    return res.status(StatusCodes.CREATED).json({
        message: 'Get all draft products successfully',
        metadata: await productService.findAllDraftsForShop(
            req.user.userId  
        )
    })
}

const getListSearchProducts = async (req, res, next) => {
    return res.status(StatusCodes.OK).json({
        message: 'Get all draft products successfully',
        metadata: await productService.searchProduct(
            {keySearch: req.params.keySearch}
        )
    })
}

const getAllPublishForShop = async (req, res, next) => {
    return res.status(StatusCodes.CREATED).json({
        message: 'Get all publish products successfully',
        metadata: await productService.findAllPublishForShop(
            req.user.userId  
        )
    })
}

const postPublishProduct = async (req, res, next) => {
    return res.status(StatusCodes.CREATED).json({
        message: `set product ${req.params.id} publish successfully`,
        metadata: await productService.publishProductByShop({
            product_shop: req.user.userId ,
            product_id: req.params.id
        })
    })
}

const postUnpublishProduct = async (req, res, next) => {
    return res.status(StatusCodes.CREATED).json({
        message: `set product ${req.params.id} unpublish successfully`, 
        metadata: await productService.unpublishProductByShop({
            product_shop: req.user.userId ,
            product_id: req.params.id
        })
    })
}



export default {
    createNewProduct,
    getAllDraftsForShop,
    getAllPublishForShop,
    postPublishProduct,
    postUnpublishProduct,
    getListSearchProducts
}