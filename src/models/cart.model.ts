import { Product } from "./product.model";

export class CartData {
    products: { product: Product; quantity: number }[];

    constructor() {
        this.products = [];
    }
    
    addProduct(product: Product, quantity: number) {
        const existingProductIndex = this.products.findIndex(p => p.product.sku === product.sku);
        if (existingProductIndex > -1) {
            this.products[existingProductIndex].quantity += quantity;
        } else {
            this.products.push({ product, quantity });
        }
    }
}