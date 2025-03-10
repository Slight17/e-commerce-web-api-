import shopModel from '../models/shop.model.js'

const findByEmail = async ({ email }, select = {
    email: 1,
    password: 1,
    name: 1,
    status: 1,
    roles: 1
}) => {
    return await shopModel.findOne({ email }).select(select).lean()
}
const deleteShop = async ({ email }, select = {}) => {
    return await shopModel.findOneAndDelete({ email }).select(select).lean()
}

const findById = async (_id) => {
    return await shopModel.findById(_id).lean()
}
export default {
    findByEmail,
    deleteShop,
    findById
};