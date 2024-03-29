import _ from 'lodash';
import { computeDiscountAndDeliveryCost } from "../src/totalDeliveryCost.js";
import {PackageInfo} from "../src/types.js";
import {RATE_PER_KG, RATE_PER_KM} from "../src/constants.js";

describe("Cost Calculation", ()=>{
    const packageOne:PackageInfo = {
        id: "PKG01",
        weight: 50,
        distance: 100,
        couponCode: "OFR001",
        index: 0
    };
    const baseDeliveryCost = 500;
    it("should calculate the delivery cost correct when package does not have offer code", ()=>{
        const {deliveryCost, discount} = computeDiscountAndDeliveryCost(packageOne, baseDeliveryCost);
        const expectedDeliveryCost = baseDeliveryCost + (packageOne.weight * RATE_PER_KG) + (packageOne.distance * RATE_PER_KM);

        expect(deliveryCost).toBe(expectedDeliveryCost);
        expect(discount).toBe(0)
    });

});