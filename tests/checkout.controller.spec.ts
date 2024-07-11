import { describe, expect, test, beforeEach, afterEach } from '@jest/globals';
import { CheckoutController } from '../src/controllers/checkout.controller';
import { Offer, OfferType } from '../src/models/offer.model';
import { Product } from '../src/models/product.model';
import { ProductOnOffer } from '../src/models/product_offer.model';

describe('CheckoutController', () => {
  let products: Product[];
  let productOnOffer: ProductOnOffer;
  let checkoutController: CheckoutController;

  beforeEach(() => {
    // Initialize products
    products = [
      new Product("ipd", "Super iPad", 549.99),
      new Product("mbp", "MacBook Pro", 1399.99),
      new Product("atv", "Apple TV", 109.50),
      new Product("vga", "VGA adapter", 30.00)
    ];

    // Initialize offers
    const THREE_FOR_TWO_OFFER = new Offer("THREE_FOR_TWO", true, 3, 3, OfferType.NUMBER, 1);
    const BULK_ABOVE_4_OFFER = new Offer("BULK_ABOVE_4", false, 4, 10, OfferType.NUMBER, 499.99);
    const BULK_ABOVE_6_10PERCENT = new Offer("BULK_ABOVE_6_10PERCENT", false, 6, 20, OfferType.PERCENT, 10);

    productOnOffer = new ProductOnOffer();
    productOnOffer.addOffer("atv", THREE_FOR_TWO_OFFER);
    productOnOffer.addOffer("ipd", BULK_ABOVE_4_OFFER);
    productOnOffer.addOffer("vga", BULK_ABOVE_6_10PERCENT);

    // Initialize CheckoutController
    checkoutController = new CheckoutController(productOnOffer.getActiveOfferProducts());
  });

  test('Total price for 3 Apple TVs and 1 VGA adapter should be $249.00', () => {
    checkoutController.scan(products[2]); // Apple TV
    checkoutController.scan(products[2]); // Apple TV
    checkoutController.scan(products[2]); // Apple TV
    checkoutController.scan(products[3]); // VGA adapter
    expect(checkoutController.total()).toBe(249.00);
  });

  test('Total price for 3 Apple TVs and 4 Super iPads should be $2718.95', () => {
    checkoutController.scan(products[2]); // Apple TV
    checkoutController.scan(products[0]); // Super iPad
    checkoutController.scan(products[0]); // Super iPad
    checkoutController.scan(products[2]); // Apple TV
    checkoutController.scan(products[0]); // Super iPad
    checkoutController.scan(products[0]); // Super iPad
    checkoutController.scan(products[0]); // Super iPad
    expect(checkoutController.total()).toBe(2718.95);
  });

  test('Apply 3-for-2 offer on Apple TVs', () => {
    checkoutController.scan(products[2]); // Apple TV
    checkoutController.scan(products[2]); // Apple TV
    checkoutController.scan(products[2]); // Apple TV
    expect(checkoutController.total()).toBe(219.00); // Price of 2 Apple TVs, 3rd is free
  });

  test('Apply 3-for-2 offer on 8 Apple TVs', () => {
    for (let i = 0; i < 8; i++) { // Scanning 8 Apple TVs to trigger 2 groups and 2 remaining
      checkoutController.scan(products[2]); // Apple TV
    }
    expect(checkoutController.total()).toBe(657.00); // 3-for-2 twice, remaining 2 full price
  });

  test('Apply 10% bulk discount on VGA', () => {
    for (let i = 0; i < 8; i++) { // Scanning 8 VGAs to trigger bulk discount
      checkoutController.scan(products[3]); // VGA adapter
    }
    expect(checkoutController.total()).toBe(216); // 8 VGAa with 10% discount each
  });

  test('No offer applied when conditions are not met', () => {
    checkoutController.scan(products[2]); // Apple TV // Only 1 Apple TV, no offer should apply
    checkoutController.scan(products[3]); // VGA adapter // VGA adapter, no offer available
    expect(checkoutController.total()).toBe(139.50); // Sum of individual prices, no discounts
  });

  afterEach(() => {
    checkoutController.clear();
  });
});