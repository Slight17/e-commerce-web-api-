import { StatusCodes } from 'http-status-codes';
import InventoryService from '../services/inventory.service';


class InventoryController {

    static async addStockToInventory(req, res, next) {
        const {  stock, productsId, shopId, location } = req.body;
        const Result = await InventoryService.addStockToInventory({
            stock, productsId, shopId, location
        });
        res.status(StatusCodes.OK).json({
            message: 'Product checkout successfully',
            metadata: Result
        });
    }

}

export default InventoryController;