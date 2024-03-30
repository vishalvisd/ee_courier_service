import _ from "lodash";
import estimatedDeliveryTime, {printResultsToConsole} from "../src/estimatedDeliveryTime.js";
import {FleetInfo, PackageInfo} from "../src/types.js";
import {printableNumber} from "../src/utils.js";

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

describe("Logging Results to console are proper", ()=>{
    const packageOne = {
        id: "PKG1",
        weight: 50,
        distance: 30,
        couponCode: "OFR001",
        index: 0
    };
    const fleetInfo = {
        num: 1,
        speed: 100,
        maxWeight: 10,
    }
    const baseDeliveryCost = 0;
    it("should log in expected format", ()=>{
        console.log = jest.fn();
        const resPackages = estimatedDeliveryTime([packageOne], fleetInfo, baseDeliveryCost);
        printResultsToConsole(resPackages);

        const resPackage = _.get(resPackages, '[0]');
        //@ts-ignore
        expect(console.log.mock.calls[0][0]).toBe(`${resPackage.id} ${printableNumber(`${resPackage.discount}`)} ${printableNumber(`${resPackage.deliveryCost}`)} ${printableNumber(`${resPackage.deliveryTime}`)}`);
    });

    it("should display N/A for values which are not available", ()=>{
        console.log = jest.fn();
        const resPackages = estimatedDeliveryTime([packageOne], fleetInfo, baseDeliveryCost);

        printResultsToConsole(resPackages);
        //@ts-ignore
        expect(console.log.mock.calls[0][0]).toBe(`${packageOne.id} N/A N/A N/A`);
    });

    afterEach(()=>{
        jest.resetAllMocks();
    })
})
