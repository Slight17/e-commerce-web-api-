
import cartModel from "../models/cart.model.js";
import productRepo from "../models/repositories/product.repo.js";
import { Types } from "mongoose";

class CartServices {

    static async createUserCart({ userId, cart_products }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateOrInsert = {
                $addToSet: {
                    cart_products: cart_products
                }
            },
            options = { upsert: true, new: true };
        return await cartModel.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCartQuantity({ userId, cart_products }) {
        const { productId, shopId, quantity: newQuantity } = cart_products;

        const cart = await cartModel.findOne({ cart_userId: userId });

        if (!cart) {
            const newCart = await cartModel.create({
                cart_userId: userId,
                cart_products: [{ productId: productId, shopId: shopId, quantity: newQuantity, old_quantity: 0 }],
            });
            return newCart;
        }

        const product = await productRepo.findProductById({ productId })

        const { product_quantity } = product

        if (newQuantity <= 0) {
            throw new Error(`Invalid quantity for product with id: ${productId}`);
        }

        const productIndex = cart.cart_products.findIndex(
            (item) => item.productId.toString() === productId.toString()
        );

        if (productIndex !== -1) {
            const currentProduct = cart.cart_products[productIndex];
            currentProduct.old_quantity = currentProduct.quantity;
            currentProduct.quantity += newQuantity;
            if (currentProduct.quantity > product_quantity) {
                throw new Error(`Insufficient quantity of product with id: ${productId}`);
            }
        } else {
            cart.cart_products.push({
                productId: productId,
                shopId: shopId,
                quantity: newQuantity,
                old_quantity: 0,
            });
        }

        const updatedCart = await cartModel.findOneAndUpdate(
            { cart_userId: userId },
            { $set: { cart_products: cart.cart_products } },
            { new: true }
        );

        return updatedCart;
    }

    static async addProductToCart({ userId, cart_products }) {

        const { productId, quantity, old_quantity, shopId, price } = cart_products

        const foundProduct = await productRepo.findProductById({ productId })


        if (!foundProduct) {
            throw new Error(`Product not found with id: ${productId}`)
        }

        const userCart = await cartModel.findOne({ cart_userId: userId })



        if (foundProduct.product_shop.toString() !== shopId) {
            throw new Error(`Product not found in shop with id: ${shopId}`)
        }

        if (productId !== foundProduct._id.toString()) {
            throw new Error(`Product not found with id: ${productId}`)
        }

        if (quantity > foundProduct.product_quantity) {
            throw new Error(`Insufficient quantity of product with id: ${productId}`)
        }

        if (quantity === 0) { await CartServices.removeProductFromCart({ userId, cartId: userCart._id, productId }) }

        if (!userCart) {
            return this.createUserCart({ userId, cart_products })
        }

        // neu co gio han roi nhung chua co san pham
        if (!userCart.cart_products.length) {
            userCart.cart_products = [cart_products]
            return await userCart.save()
        }

        return await this.updateUserCartQuantity({ userId, cart_products })
    }

    static async increaseProductQuantity({ userId, productId }) {
        const query = { cart_userId: userId, 'cart_products.productId': productId, cart_state: 'active' },
            updateOrInsert = {
                $inc: {
                    'cart_products.$.quantity': 1,
                    'cart_products.$.old_quantity': 1
                }
            },
            options = { new: true };

        return await cartModel.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async decreaseProductQuantity({ userId, productId }) {


        const query = { cart_userId: userId, 'cart_products.productId': productId, cart_state: 'active' },
            updateOrInsert = {
                $inc: {
                    'cart_products.$.quantity': -1,
                    'cart_products.$.old_quantity': -1
                }
            },
            options = { new: true };

        const updatedCart = await cartModel.findOneAndUpdate(query, updateOrInsert, options);

        // Remove product if quantity is zero
        if (updatedCart) {
            const product = updatedCart.cart_products.find(p => p.product_id === productId);
            if (product && product.quantity <= 0) {
                await cartModel.updateOne(
                    { cart_userId: userId, cart_state: 'active' },
                    { $pull: { cart_products: { product_id: productId } } }
                );
            }
        }

        return updatedCart;
    }


    static async removeProductFromCart({ userId, cartId, productId }) {
        return await cartModel.updateOne(
            { cart_userId: userId, _id: new Types.ObjectId(cartId), cart_state: 'active' },
            { $pull: { cart_products: { productId: productId } } },
            { new: true }
        );
    }
}

export default CartServices;