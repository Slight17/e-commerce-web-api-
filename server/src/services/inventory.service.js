import inventoriesModel from "../models/inventories.model.js";
import productRepo from "../models/repositories/product.repo.js";

class InventoryService {

    static async addStockToInventory({
        stock, productsId, shopId, location
    }) {
        const product = await productRepo.findProductById({ productsId })
        if (!product) throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found')
            
        const query = {
            inven_shopId: shopId, inven_productId: productsId
        },updateSet = {
            $inc: { inven_stock: stock },
            $set: { inven_location: location }
        }, options = {
            new: true, upsert: true
        }

        return await inventoriesModel.findOneAndUpdate(query, updateSet, options)
    }
}

export default InventoryService;