import productModel from '../models/product.model.js'
import { ApiError } from '../handles/error.handle.js'
import { StatusCodes } from 'http-status-codes'
import { Types } from 'mongoose';
import productRepo from '../models/repositories/product.repo.js';

//define Factory class to create product
class ProductFactory {

    static productRegistry = {}

    static registerProduct(type, productClass) {
        ProductFactory.productRegistry[type] = productClass;
    }


    /*
    register a new product class with config file export as a object with format {nameClass: Class}
    */

    // static registerProductsFromConfig(config) {
    //     Object.entries(config).forEach(([type, productClass]) => {
    //         // Đăng ký từng product class vào registry
    //         ProductFactory.productRegistry[type.toLowerCase()] = productClass;
    //     });
    // }



    /*
    type: 'clothing'
    payload: 
    */

    //create product 
    static async createProduct(type, payload) {
        //check type of payload in product class
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new ApiError(StatusCodes.BAD_REQUEST, `Could not find product class ${type}`)
        return new productClass(payload).createProduct()
    }

    static async updateProduct(type, payload) {
        //check type of payload in product class
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new ApiError(StatusCodes.BAD_REQUEST, `Could not find product class ${type}`)
        return new productClass(payload).createProduct()
    }



    //PUT//
    static async publishProductByShop({ product_shop, product_id }) {
        return productRepo.setPublishedProduct({ product_shop, product_id })
    }

    static async unpublishProductByShop({ product_shop, product_id }) {
        console.log('product id', product_id)
        return productRepo.setUnpublishedProduct({ product_shop, product_id })
    }


    //END PUT//

    //query 



    static async findAllDraftsForShop(product_shop, limit = 50, skip = 0) {
        const query = { product_shop, isDraft: true }
        return productRepo.queryProduct({ query, limit, skip })
    }

    static async findAllPublishForShop(product_shop, limit = 50, skip = 0) {
        const query = { product_shop, isPublished: true }
        return productRepo.queryProduct({ query, limit, skip })
    }

    static async searchProduct({keySearch}){
        return productRepo.searchProducts({keySearch})
    }
    
    static async findAllProducts({limit = 50, sort = 'ctime', page = 1, fliter = {isPublished: true}}){
        return await productRepo.findAllProducst()
    }

    static async findProduct(){
        return await productRepo.findProduct()
    }
}

/*
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: 'string' },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_types: { type: String, required: true, enum: ['Electronic', 'Clothing', 'Furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true }
*/




//define base product class



class Product {
    constructor({
        product_name, product_thumb, product_description, product_price,
        product_quantity, product_types, product_shop, product_attributes
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_types = product_types
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    async createProduct(product_id) {
        return await productModel.product.create({ ...this, _id: product_id })
    }
}

//define sub-class for different product type Clothing

class Clothing extends Product {
    async createClothing() {
        const newClothing = await productModel.clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing) throw ApiError(StatusCodes, `Cannot create clothing  product`)

        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw ApiError(StatusCodes, `Cannot create product class`)

        return newProduct
    }
}

class Electronic extends Product {
    async createElectronic() {
        const newElectronic = await productModel.electronics.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw ApiError(StatusCodes, `Cannot create clothing  product`)

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw ApiError(StatusCodes, `Cannot create product class`)

        return newProduct
    }
}

class Furniture extends Product {
    async createFurniture() {

        const newFurniture = await productModel.furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })

        if (!newFurniture) throw ApiError(StatusCodes, `Cannot create furniture  product`)

        const newProduct = await super.createProduct(newFurniture._id)

        if (!newProduct) throw ApiError(StatusCodes, `Cannot create product class`)

        return newProduct
    }
}

//registering product types with their respective classes
ProductFactory.registerProduct('Clothing', Clothing)
ProductFactory.registerProduct('Electronic', Electronic)
ProductFactory.registerProduct('Furniture', Furniture)

export default ProductFactory;