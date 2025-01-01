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

//patch product

const updateProduct = async (req, res, next) => {
    return res.status(StatusCodes.OK).json({
        message: 'updated product successfully',
        metadata: await productService.updateProduct(
            req.body.product_type,
            req.params.productId,
            {
                ...req.body,
                product_shop: req.user.userId
            }
        )
    })
}

//get methods

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
            { keySearch: req.params.keySearch }
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

//post methods

const postPublishProduct = async (req, res, next) => {
    return res.status(StatusCodes.CREATED).json({
        message: `set product ${req.params.id} publish successfully`,
        metadata: await productService.publishProductByShop({
            product_shop: req.user.userId,
            product_id: req.params.id
        })
    })
}

const postUnpublishProduct = async (req, res, next) => {
    return res.status(StatusCodes.CREATED).json({
        message: `set product ${req.params.id} unpublish successfully`,
        metadata: await productService.unpublishProductByShop({
            product_shop: req.user.userId,
            product_id: req.params.id
        })
    })
}

// Query

const findAllProducts = async (req, res, next) => {
    return res.status(StatusCodes.OK).json({
        message: `find all products successfully !!`,
        metadata: await productService.findAllProducts(req.query)
    })
}

const findProduct = async (req, res, next) => {
    return res.status(StatusCodes.OK).json({
        message: `find all products successfully !!`,
        metadata: await productService.findProduct({
            product_id: req.params.product_id
        })
    })
}


export default {
    createNewProduct,
    getAllDraftsForShop,
    getAllPublishForShop,
    postPublishProduct,
    postUnpublishProduct,
    getListSearchProducts,
    findAllProducts,
    findProduct,
    updateProduct
}