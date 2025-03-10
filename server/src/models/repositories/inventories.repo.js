import { Types } from "mongoose"
import inventoriesModel from "../inventories.model.js"


const insertInventory = async ({
    product_id, shop_id, stock, location = 'unknown'
}) => {
    console.log(product_id)
    return await inventoriesModel.create({
        inven_productId: product_id,
        inven_shopId: shop_id,
        inven_stock: stock,
        inven_location: location,
    })
}


const revervationInventory = async ({
    productId, quantity, cartId
}) => {
    const query = {
        inven_productId: new Types.ObjectId(productId),
        inven_stock: { $gte: quantity }
    },
    updateSet = {
        $inc: { inven_stock: -quantity },
        $push: { inven_revervation: {
            quantity,
            cartId,
            createdAt: new Date(),
        }}
    },
    options = {
        upsert: true,
        new: true,
    }

    return await inventoriesModel.updateOne(query, updateSet, options)
}

export default {insertInventory, revervationInventory}