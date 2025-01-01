import { StatusCodes } from "http-status-codes"
import DiscountServices from "../services/discount.service.js"


class DiscountController {
    createDiscountCode = async (req, res, next) => {
        return res.status(StatusCodes.CREATED).json({
            message: 'created discount code successfully',
            metadata: await DiscountServices.createDiscountCode({
                ...req.body,
                discount_shopId: req.user.userId
            })
        })
    }


    getAllDiscountCodes = async (req, res, next) => {
        return res.status(StatusCodes.OK).json({
            message: 'get all discount codes successfully',
            metadata: await DiscountServices.getAllDiscountCodes({
                ...req.query,
            })
        })
    }

    getDiscountAmount = async (req, res, next) => {
        return res.status(StatusCodes.OK).json({
            message: 'get discount amount successfully',
            metadata: await DiscountServices.getDiscountAmount({
                ...req.body
            })
        })
    }

    getAllDiscountCodeWithProduct = async (req, res, next) => {
        return res.status(StatusCodes.OK).json({
            message: 'get all discount codes with prodcut successfully',
            metadata: await DiscountServices.getAllDiscountCodeWithProduct({
                ...req.query
            })
        })
    }

    deleteDiscountCodes = async (req, res, next) => {
        return res.status(StatusCodes.OK).json({
            message: 'delete discount code successfully',
            metadata: await DiscountServices.deleteDiscountCodes({
                ...req.query,
                shopId: req.user.userId
            })
        })
    }

    cancelDiscountCode = async (req, res, next) => {
        return res.status(StatusCodes.OK).json({
            message: 'get all discount codes with prodcut successfully',
            metadata: await DiscountServices.cancelDiscountCode({
                ...req.query,
                userId: req.user.userId
            })
        })
    }
}

export default new DiscountController()