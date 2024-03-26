import _ from 'lodash';
import { computeDiscountAndDeliveryCost } from "../src/totalDeliveryCost";
import {PackageInfo} from "../src/types";
import {RATE_PER_KG, RATE_PER_KM} from "../src/constants";
import coupons from "../src/coupons";

describe("Cost Calculation", ()=>{
    const packageOne:PackageInfo = {
        id: "PKG01",
        weight: 50,
        distance: 100,
        couponCode: null,
        index: 0
    };
    const baseDeliveryCost = 500;
    it("should calculate the delivery cost correct when package does not have offer code", ()=>{
        const {deliveryCost, discount} = computeDiscountAndDeliveryCost(packageOne, baseDeliveryCost);
        const expectedDeliveryCost = baseDeliveryCost + (packageOne.weight * RATE_PER_KG) + (packageOne.distance * RATE_PER_KM);

        expect(deliveryCost).toBe(expectedDeliveryCost);
        expect(discount).toBe(0)
    });

    it("should calculate the delivery cost correct when package have offer code", ()=>{
        const randomSelectedCouponName = _.keys(coupons)[_.random(0, _.size(coupons))]
        packageOne.couponCode = randomSelectedCouponName;
        const couponData = coupons[randomSelectedCouponName];

        const {deliveryCost, discount} = computeDiscountAndDeliveryCost(packageOne, baseDeliveryCost);
        const expectedDeliveryCost = baseDeliveryCost + (packageOne.weight * RATE_PER_KG) + (packageOne.distance * RATE_PER_KM);
        let expectedDiscount = 0;

        if (packageOne.distance >= couponData.conditions.minDistance
            && packageOne.distance <= couponData.conditions.maxDistance
            && packageOne.weight >= couponData.conditions.minWeight
            && packageOne.weight <= couponData.conditions.maxWeight){
            expectedDiscount = expectedDeliveryCost * couponData.discount_percent / 100;
        }

        expect(deliveryCost).toBe(expectedDeliveryCost);
        expect(discount).toBe(expectedDiscount);
    })
});