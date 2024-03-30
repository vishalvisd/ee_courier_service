import _ from 'lodash';
import {knapsack, printableNumber} from "./utils.js";
import {computeDiscountAndDeliveryCost} from "./totalDeliveryCost.js";
import {FleetInfo, PackageInfo} from "./types.js";

export const printResultsToConsole = (packages: Array<PackageInfo>): void => {
    _.forEach(packages, pkg =>{
        console.log(`${pkg.id} ${printableNumber(`${pkg.discount}`)} ${printableNumber(`${pkg.deliveryCost}`)} ${printableNumber(`${pkg.deliveryTime}`)}`)
    })
}

const computeDeliveryTimeAndCost = (deliveryItems: Array<PackageInfo>, previousLogged: number, fleetSpeed: number, baseDeliveryCost: number):Array<PackageInfo> => {
    return deliveryItems.map((v:PackageInfo) => {
        const {deliveryCost, discount} = computeDiscountAndDeliveryCost(v, baseDeliveryCost);
        const wait = _.floor(previousLogged / fleetSpeed, 2) * 2;
        const currentDeliveryTime = _.floor(v.distance/fleetSpeed, 2);

        v.deliveryTime = _.round(wait + currentDeliveryTime, 2)
        v.deliveryCost = deliveryCost;
        v.discount = discount;
        return v;
    })
}

const nextAvailableTripPackages = (deliveryPackages: Array<PackageInfo>, maxWeight: number)=>{
    const selectedPackagesIndex = knapsack(_.map(deliveryPackages, v => v.weight), maxWeight);
    const nextTripSelectedPackages = _.remove(deliveryPackages, (_v, i) => selectedPackagesIndex.includes(i));
    return {
        selectedPackagesIndex,
        nextTripSelectedPackages,
        remainingPackages: deliveryPackages
    }
}

export default function (packages: Array<PackageInfo>, fleetInfo: FleetInfo, baseDeliveryCost: number): Array<PackageInfo>{
    const computeDeliveryTimeAndCostCurried = _.curryRight(computeDeliveryTimeAndCost)(fleetInfo.speed, baseDeliveryCost);

    const distanceLoggedByVehicle = Array(fleetInfo.num).fill(0);
    const tasksByVehicle = Array(fleetInfo.num).fill([]);

    (function getOrderOfDelivery(deliveryPackages){
        if (_.size(deliveryPackages) > 0){
            // Select Items for next delivery
            const {selectedPackagesIndex, nextTripSelectedPackages, remainingPackages} = nextAvailableTripPackages(deliveryPackages, fleetInfo.maxWeight)
            if (selectedPackagesIndex.length <= 0) return;

            //Compute Delivery Time and Cost
            const vehicleChosenIndex = _.indexOf(distanceLoggedByVehicle, _.min(distanceLoggedByVehicle));
            computeDeliveryTimeAndCostCurried(nextTripSelectedPackages, distanceLoggedByVehicle[vehicleChosenIndex]);

            // Update Vehicle tasks
            tasksByVehicle[vehicleChosenIndex].push(nextTripSelectedPackages);
            distanceLoggedByVehicle[vehicleChosenIndex] += _.max(_.map(nextTripSelectedPackages, v => v.distance));

            // Update Packages with details - delivery time, cost, and discount
            _.forEach(nextTripSelectedPackages, pkg => {
                packages[pkg.index] = _.assign({}, packages[pkg.index], pkg)
            });

            getOrderOfDelivery(remainingPackages);
        }
    })(_.map(packages, (v, i) => Object.assign({}, v, {index: i})));

    return packages;
}
