enum OfferType {
    PERCENT = 'PERCENT',
    NUMBER = 'NUMBER'
}
export { OfferType };
export class Offer {
    id: string;
    isGrouped = false;
    minQuantity = 0;
    maxQuantity = 0;
    offerType: OfferType;
    offerValue: number;

    constructor(
        id: string,
        isGrouped: boolean,
        minQuantity: number,
        maxQuantity: number,
        offerType: OfferType,
        offerValue: number
    ) {
        this.id = id;
        this.isGrouped = isGrouped;
        this.minQuantity = minQuantity;
        this.maxQuantity = maxQuantity;
        this.offerType = offerType;
        this.offerValue = offerValue;
    }
}
