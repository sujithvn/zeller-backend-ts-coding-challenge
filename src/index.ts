import { Product } from "./models/product.model";
import { Offer } from "./models/offer.model";
import { ProductOnOffer } from "./models/product_offer.model";
import { CheckoutController } from "./controllers/checkout.controller";

enum OfferType {
    PERCENT = 'PERCENT',
    NUMBER = 'NUMBER'
}

const localStore = [
    {
        sku: "ipd",
        name: "Super IPad",
        price: 549.99
    },
    {
        sku: "mbp",
        name: "Mackbook Pro",
        price: 1399.99
    },
    {
        sku: "atv",
        name: "Apple TV",
        price: 109.50
    },
    {
        sku: "vga",
        name: "VGA Adapter",
        price: 30
    }
];

const products = localStore.map(product => new Product(product.sku, product.name, product.price));

const THREE_FOR_TWO_OFFER = new Offer("THREE_FOR_TWO", true, 3, 3, OfferType.NUMBER, 1);
const BULK_ABOVE_4_OFFER = new Offer("BULK_ABOVE_4", false, 4, 10, OfferType.NUMBER, 499.99);

const productOnOffer = new ProductOnOffer();
productOnOffer.addOffer("atv", THREE_FOR_TWO_OFFER);
productOnOffer.addOffer("ipd", BULK_ABOVE_4_OFFER);

const checkoutController = new CheckoutController(productOnOffer.getActiveOfferProducts());

// SKUs Scanned: atv, atv, atv, vga Total expected: $249.00
checkoutController.scan(products[2]);
checkoutController.scan(products[2]);
checkoutController.scan(products[2]);
checkoutController.scan(products[3]);
console.log(checkoutController.total());

checkoutController.clear();

// SKUs Scanned: atv, ipd, ipd, atv, ipd, ipd, ipd Total expected: $2718.95
checkoutController.scan(products[2]);
checkoutController.scan(products[0]);
checkoutController.scan(products[0]);
checkoutController.scan(products[2]);
checkoutController.scan(products[0]);
checkoutController.scan(products[0]);
checkoutController.scan(products[0]);

console.log(checkoutController.total());


