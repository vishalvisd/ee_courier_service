import estimatedDeliveryTime from "../src/estimatedDeliveryTime";
import {FleetInfo, PackageInfo} from "../src/types";

describe("Delivery time Calculation", ()=>{
    const packages: Array<PackageInfo> = [{
        id: "PKG1",
        weight: 50,
        distance: 30,
        couponCode: "OFR001",
        index: 0
    }, {
        id: "PKG1",
        weight: 75,
        distance: 125,
        couponCode: "OFR0008",
        index: 1
    }, {
        id: "PKG1",
        weight: 175,
        distance: 100,
        couponCode: "OFR003",
        index: 2
    }, {
        id: "PKG1",
        weight: 110,
        distance: 60,
        couponCode: "OFR002",
        index: 3
    }, {
        id: "PKG1",
        weight: 155,
        distance: 95,
        couponCode: "NA",
        index: 4
    }];
    const baseDeliveryCost = 200;
    const fleetInfo:FleetInfo = {
        num: 2,
        speed: 70,
        maxWeight: 200,
    }

    it("should calculate delivery time correctly", ()=>{
        const packagesWithDetails = estimatedDeliveryTime(packages, fleetInfo, baseDeliveryCost);

        expect(`${packagesWithDetails[0].deliveryTime}`).toBe("3.98");
        expect(`${packagesWithDetails[1].deliveryTime}`).toBe("1.78");
        expect(`${packagesWithDetails[2].deliveryTime}`).toBe("1.42");
        expect(`${packagesWithDetails[3].deliveryTime}`).toBe("0.85");
        expect(`${packagesWithDetails[4].deliveryTime}`).toBe("4.19");
    })
});
