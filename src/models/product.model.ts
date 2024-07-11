export class Product {
    sku: string;
    name: string;
    price: number;

    constructor(sku: string, name: string, price: number) {
        this.name = name;
        this.sku = sku;
        this.price = price;
    }
}