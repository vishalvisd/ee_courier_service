import _ from 'lodash';
import coupons from "./coupons.js";
import {PackageInfo} from "./types.js";
import {RATE_PER_KG, RATE_PER_KM} from "./constants.js";

export const printResultsToConsole = (packages: Array<PackageInfo>) => {
    _.forEach(packages, pkg => {
        console.log(`${pkg.id} ${pkg.discount} ${pkg.deliveryCost}`)
    })
}

export const computeDiscountAndDeliveryCost = (pkg:PackageInfo, baseDeliveryCost: number):{deliveryCost: number, discount: number} => {
    const deliveryCost = baseDeliveryCost + (pkg.weight * RATE_PER_KG) + (pkg.distance * RATE_PER_KM);

    // Calculate Discounts
    let discount = 0;
    const coupon = pkg.couponCode;
    if (coupon){
        if (_.keys(coupons).includes(coupon)){
            const couponData = coupons[coupon];
            if (pkg.distance >= couponData.conditions.minDistance
                && pkg.distance <= couponData.conditions.maxDistance
                && pkg.weight >= couponData.conditions.minWeight
                && pkg.weight <= couponData.conditions.maxWeight){
                discount = deliveryCost * couponData.discount_percent / 100;
            }
        }
    }

    return {
        deliveryCost: _.round(deliveryCost - discount, 2),
        discount
    };
}

export default function (packages: Array<PackageInfo>, baseDeliveryCost: number): Array<PackageInfo>{
    _.forEach(packages, pkg => {
        const {deliveryCost, discount} = computeDiscountAndDeliveryCost(pkg, baseDeliveryCost);
        pkg.discount = discount;
        pkg.deliveryCost = deliveryCost;
    })

    return packages;
};
