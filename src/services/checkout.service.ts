import { CartData } from "../models/cart.model";
import { Cart } from "../models/interfaces/cart.interface";
import { Offer } from "../models/offer.model";
import { Product } from "../models/product.model";

export class CheckoutService implements Cart {
    public cart: CartData = new CartData();
    private offers: Map<string, Offer>;

    constructor(offers: Map<string, Offer>) {
        this.offers = offers;
    }

    scan(item: Product): void {
        console.log('CheckoutService scan', item);
        this.cart.addProduct(item, 1);
    }

    total(): number {
        console.log('CheckoutService Processing Total')
        let total = 0;
        console.log('this.cart.products=', this.cart.products)

        // loop through the cart products and calculate the total
        // for each product, check if there is an offer
        // if there is an offer, apply the offer
        // if there is no offer, apply the product price
        this.cart.products.forEach(cartItem => {
            const product = cartItem.product;
            const quantity = cartItem.quantity;
            const offer = this.offers.get(product.sku);
            console.log('LOOPING thru CART - product=', product, 'quantity=', quantity, 'offer=', offer)

            // if there is NO offer, apply the product price and continue to the next product
            if (!offer) {
                console.log('NO OFFER, applying product price ', product.price * quantity)
                total += product.price * quantity;
                return;
            }

            // if the quantity is less than the min quantity required for the offer, apply the product price
            // if the quantity > maxQuantity for the offer, apply the offer price for the maxQuantity and apply the product price for the remaining quantity
            // if the quantity is between the min and max quantity (inclusive), apply the offer price
            // if the isGrouped is true, separate the quantity into groups of minQuantity and apply the offer price for each group
            // if isGrouped is true, the offerValue is the group discount and has to be applied to each group
            // if the offerType = 'PERCENT' apply the offerValue as a percentage of the product price
            // if the offerType = 'NUMBER' apply the offerValue as the price for the offer quantity 

            const offerMinQuantity = offer.minQuantity;
            const offerMaxQuantity = offer.maxQuantity;
            const offerType = offer.offerType;
            const offerValue = offer.offerValue;
            const isGrouped = offer.isGrouped;

            // if the quantity is less than the min quantity required for the offer, apply the product price and continue to the next product
            if (quantity < offerMinQuantity) {
                console.log('quantity < offerMinQuantity, no offers applied');
                total += product.price * quantity;
                return;
            }

            // these could be item to be considered as a group and may have items remaining after the group
            // for grouped items, minQuantity is the number of items in a group & offerValue is items to be discounted
            if (isGrouped) { 
                const numberOfGroups = Math.floor(quantity / offerMinQuantity);
                const remainingQuantity = quantity % offerMinQuantity;
                const singleGroupTotal = (offerMinQuantity * product.price )- (offerValue * product.price);
                console.log({numberOfGroups, singleGroupTotal, remainingQuantity})
                total += numberOfGroups * singleGroupTotal + remainingQuantity * product.price;
            } else {
                const offerQuantity =  quantity > offerMaxQuantity ? offerMaxQuantity : quantity;
                const remainingQuantity = quantity > offerMaxQuantity ? quantity % offerQuantity : 0;
                console.log({offerQuantity, remainingQuantity})
                if (offerType === 'NUMBER') {
                    console.log('offerType === NUMBER, offerPriceTotal=', offerQuantity * offerValue)
                    console.log('offerType === NUMBER, remainingPriceTotal=', remainingQuantity * product.price)
                    total += offerQuantity * offerValue;
                    total += remainingQuantity * product.price;
                }
                if (offerType === 'PERCENT') {
                    console.log('offerType === PERCENT, offerPriceTotal=', (product.price * offerQuantity * (1 - offerValue / 100)))
                    console.log('offerType === PERCENT, remainingPriceTotal=', remainingQuantity * product.price)
                    total += product.price * offerQuantity * (1 - offerValue / 100);
                    total += remainingQuantity * product.price;
                } 
            }
        });

        return parseFloat(total.toFixed(2));
    }

    // clear the cart
    clear(): void {
        this.cart.products = [];
    }

}