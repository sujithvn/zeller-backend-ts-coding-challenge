import { Offer } from "./offer.model";

export class ProductOnOffer {
    activeOfferProducts: Map<string, Offer> = new Map();

    addOffer(sku: string, offer: Offer) {
        this.activeOfferProducts.set(sku, offer)
    }

    getActiveOfferProducts() {
        return this.activeOfferProducts;
    }
}