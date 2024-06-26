import _ from 'lodash';
import { knapsack } from "./utils.js";
import { computeDiscountAndDeliveryCost } from "./totalDeliveryCost.js";
export const printResultsToConsole = (packages) => {
    _.forEach(packages, pkg => {
        console.log(`${pkg.id} ${pkg.discount} ${pkg.deliveryCost} ${pkg.deliveryTime}`);
    });
};
const computeDeliveryTime = (deliveryItems, previousLogged, fleetSpeed) => {
    return deliveryItems.map((v) => {
        const wait = _.floor(previousLogged / fleetSpeed, 2) * 2;
        const currentDeliveryTime = _.floor(v.distance / fleetSpeed, 2);
        v.deliveryTime = _.round(wait + currentDeliveryTime, 2);
        return v;
    });
};
export default function (packages, fleetInfo, baseDeliveryCost) {
    const computeDeliveryTimeCurried = _.curryRight(computeDeliveryTime)(fleetInfo.speed);
    const copyOfPackages = _.map(packages, (v, i) => Object.assign({}, v, { index: i }));
    // Allocate tasks to delivery vehicles
    const distnaceLoggedByVehicle = Array(fleetInfo.num).fill(0);
    const tasksByVehicle = Array(fleetInfo.num).fill([]);
    (function getOrderOfDelivery(deliveryPackages) {
        if (_.size(deliveryPackages) > 0) {
            const selectedItems = knapsack(_.map(deliveryPackages, v => v.weight), fleetInfo.maxWeight);
            const deliveringItems = _.remove(deliveryPackages, (_v, i) => selectedItems.includes(i));
            //Compute Delivery Time
            const vehicleChosenIndex = _.indexOf(distnaceLoggedByVehicle, _.min(distnaceLoggedByVehicle));
            const vehicleDistanceThisTrip = _.max(_.map(deliveringItems, v => v.distance));
            const previousDistanceLogged = distnaceLoggedByVehicle[vehicleChosenIndex];
            const deliveringItemsWithDeliveryTime = computeDeliveryTimeCurried(deliveringItems, previousDistanceLogged);
            _.forEach(deliveringItemsWithDeliveryTime, (v) => {
                packages[v.index].deliveryTime = v.deliveryTime;
                const { deliveryCost, discount } = computeDiscountAndDeliveryCost(v, baseDeliveryCost);
                packages[v.index].deliveryCost = deliveryCost;
                packages[v.index].discount = discount;
            });
            tasksByVehicle[vehicleChosenIndex].push(deliveringItemsWithDeliveryTime);
            distnaceLoggedByVehicle[vehicleChosenIndex] = previousDistanceLogged + vehicleDistanceThisTrip;
            getOrderOfDelivery(deliveryPackages);
        }
    })(copyOfPackages);
    return packages;
}
//# sourceMappingURL=estimatedDeliveryTime.js.map