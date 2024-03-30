import _ from 'lodash';
import {getPricingData} from "./pricingDataFileParser.js";
import {Coupon, PackageInfo} from "./types.js";
import {DEFAULT_RATE_PER_KG, DEFAULT_RATE_PER_KM} from "./constants.js";

export const printResultsToConsole = (packages: Array<PackageInfo>) => {
    _.forEach(packages, pkg => {
        console.log(`${pkg.id} ${pkg.discount} ${pkg.deliveryCost}`)
    })
}

export const computeDiscountAndDeliveryCost = (pkg:PackageInfo, baseDeliveryCost: number):{deliveryCost: number, discount: number} => {
    const pricingData = getPricingData()!;

    const ratePerKg = _.get(pricingData, "rate_per_kg", DEFAULT_RATE_PER_KG);
    const ratePerKm = _.get(pricingData, "rate_per_km", DEFAULT_RATE_PER_KM);
    const deliveryCost = baseDeliveryCost + (pkg.weight * ratePerKg) + (pkg.distance * ratePerKm);

    const availableCoupons = pricingData?.coupons;
    let discountRate = 0;
    const couponCodeAppliedOnPackage = pkg.couponCode;
    if (availableCoupons){
        const couponData:Coupon = availableCoupons[couponCodeAppliedOnPackage];
        if (couponData){
            let conditionMet = null;
            for (let condition in couponData.conditions){
                if (condition === 'minDistance'){
                    conditionMet = pkg.distance >= couponData.conditions[condition]!
                } else if (condition === 'maxDistance'){
                    conditionMet = pkg.distance <= couponData.conditions[condition]!
                } else if (condition === 'minWeight'){
                    conditionMet = pkg.weight >= couponData.conditions[condition]!
                } else if (condition === 'maxWeight'){
                    conditionMet = pkg.weight <= couponData.conditions[condition]!
                }
                if (conditionMet === false){
                    break;
                }
            }
            if (conditionMet){
                discountRate = couponData.discount_percent / 100;
            }
        }
    }

    const discount = deliveryCost * discountRate;
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