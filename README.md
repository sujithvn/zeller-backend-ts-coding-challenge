Zeller is starting a computer store. You have been engaged to build the checkout system. We will start with the following products in our catalogue


| SKU     | Name        | Price    |
| --------|:-----------:| --------:|
| ipd     | Super iPad  | $549.99  |
| mbp     | MacBook Pro | $1399.99 |
| atv     | Apple TV    | $109.50  |
| vga     | VGA adapter | $30.00   |

As we're launching our new computer store, we would like to have a few opening day specials.

- we're going to have a 3 for 2 deal on Apple TVs. For example, if you buy 3 Apple TVs, you will pay the price of 2 only
- the brand new Super iPad will have a bulk discounted applied, where the price will drop to $499.99 each, if someone buys more than 4

As our Sales manager is quite indecisive, we want the pricing rules to be as flexible as possible as they can change in the future with little notice.

Our checkout system can scan items in any order.

The interface to our checkout looks like this (shown in typescript):

```typescript
  const co = new Checkout(pricingRules);
  co.scan(item1);
  co.scan(item2);
  co.total();
```

Your task is to implement a checkout system that fulfils the requirements described above.

Example scenarios
-----------------

SKUs Scanned: atv, atv, atv, vga
Total expected: $249.00

SKUs Scanned: atv, ipd, ipd, atv, ipd, ipd, ipd
Total expected: $2718.95

Notes on implementation:

- use **Typescript**
- try not to spend more than 2 hours maximum. (We don't want you to lose a weekend over this!)
- don't build guis etc, we're more interested in your approach to solving the given task, not how shiny it looks
- don't worry about making a command line interface to the application
- don't use any frameworks

When you've finished, send through the link to your github-repo.

Solution
-----------------

We can run/test with below commands.
```
npm start

npm run test
```
I have included an easy and generic way for adding new pricing-plan/offer. It is easy to extend this with minimal code change, just adding one line entry for each new plan.

We can also use the same plan for multiple SKUs by just re-using the offer-id (with `productOnOffer.addOffer`).

Examples below:

    const THREE_FOR_TWO_OFFER = new Offer("THREE_FOR_TWO", true, 3, 3, OfferType.NUMBER, 1);
    

In the above example, the 2nd argument `true` for the field `isGrouped` specifies that we are applying discount for buying in groups, like 3 for price of 2. In this case we set min & max quantity as 3 and the last field `offerValue` specifies the number of items to be discounted for each such group. In the above case, it is 1 qty (3 for 2).

---

    const BULK_ABOVE_4_OFFER = new Offer("BULK_ABOVE_4", false, 4, 10, OfferType.NUMBER, 499.99);

In the above example, it is NOT a `grouped` offer. Here we are applying a flat price of 499.99 if the quantity is above 4

---

    
    const BULK_ABOVE_6_10PERCENT = new Offer("BULK_ABOVE_6_10PERCENT", false, 6, 20, OfferType.PERCENT, 10);

In the above example, it is NOT a `grouped` offer. Here we are applying a 10% of product price if the quantity is above 6

---

Issues & Future improvements
---

There are few items to be fixed for the above solution. I have not implemented them since it was not part of the core requirement.

1. Multiple pricingPlan for single SKU. Currently we support only one plan, if multiple plans has to be supported, we need to implement logic for setting priority and avoiding clashes
2. Add new fields for each plan like `startDate` and `endDate`. This will restrict the plan to specific offer periods.
3. We can improve to track the number of times a offer is used, offer used per customer etc.