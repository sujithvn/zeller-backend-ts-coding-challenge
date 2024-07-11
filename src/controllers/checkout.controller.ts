import { Offer } from "../models/offer.model";
import { CheckoutService } from "../services/checkout.service";
import { Product } from "../models/product.model";

export class CheckoutController {
    private checkoutService: CheckoutService;
    constructor(offers: Map<string, Offer>) {
        this.checkoutService = new CheckoutService(offers);
    }

    scan(item: Product): void {
        this.checkoutService.scan(item);
    }

    total(): number {
        return this.checkoutService.total();
    }

    clear(): void {
        this.checkoutService.cart.products = [];
    }
    
}