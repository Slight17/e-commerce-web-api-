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


export default {insertInventory}