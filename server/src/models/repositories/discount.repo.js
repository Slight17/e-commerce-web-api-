import { getSelectData, unGetSelectData } from "../../utils/index.js"
import discountModel from "../discount.model.js"



class DiscountRepo {
    static async findDiscountByCode({ model, filter }) {
        return await model.findOne(filter).lean()
    }

    static async findAllDiscountsCodeUnselect({ limit = 50, sort = 'ctime', page = 1, fliter, unSelect, model }) {
        const skip = (page - 1) * limit
        const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

        return await model.find(fliter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .select(unGetSelectData(unSelect))
            .lean()
    }

    static async findAllDiscountsCodeSelect({ limit = 50, sort = 'ctime', page = 1, fliter, select, model }) {
        const skip = (page - 1) * limit
        const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

        return await model.find(fliter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .select(getSelectData(select))
            .lean()
    }
}

export default DiscountRepo