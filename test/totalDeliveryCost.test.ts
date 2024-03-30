import _ from "lodash";
import {Coupon, PackageInfo, ParsedUserInput, PricingData} from "../src/types.js";
import {DEFAULT_RATE_PER_KG, DEFAULT_RATE_PER_KM} from "../src/constants.js";
import totalDeliveryCost, {computeDiscountAndDeliveryCost, printResultsToConsole as printDeliveryCostResults} from "../src/totalDeliveryCost.js";
import {getPricingData} from "../src/pricingDataFileParser.js";
import userInputParser from "../src/userInputParser.js";

describe("Delivery Cost Calculation", () => {
    it("should compute delivery cost correctly for the given Rates per KM and per KG and use default when not provided", () => {

        // Here, we are only going to test for various combination of VALID values which are accepted by the 'userInputParser.ts'
        // i.e. values entered through command line
        // Invalid values are already tested separately for error being thrown by the 'userInputParser.ts'
        const commandLineNumberInputs = [100];
        const commandLineDiscountCodeInputs = ["OFR001", "invalid", "", " "];
        const programInputs: string[] = [];
        commandLineNumberInputs.forEach(baseRate => {
            commandLineNumberInputs.forEach(distance => {
                commandLineNumberInputs.forEach(weight => {
                    commandLineDiscountCodeInputs.forEach(discount_code => {
                        programInputs.push(`${baseRate} 1\npkg1 ${weight} ${distance} ${discount_code}\n2 70 200`)
                    })
                })
            })
        });

        // Coupons and Rates are provided separately via a JSON file.
        // The testing for the proper parsing of the JSON file is taken care separately ('pricingDataFileParser.test.ts')
        // Here we are going to mock the parsed value of the pricing file and simulate various rates
        const rates = [{
            rate_per_km: 50,
            rate_per_kg: 50
        }, {
            rate_per_km: 0,
            rate_per_kg: 50
        }, {
            rate_per_km: 50,
            rate_per_kg: 0
        }, {
            rate_per_km: 0,
            rate_per_kg: 0
        }];

        const computeForGivenRates = () => {
            const pricingData = getPricingData()!;
            programInputs.forEach((programInput, index) => {
                const parsedInput: ParsedUserInput = userInputParser(programInput)!;

                const {packages, baseDeliveryCost} = parsedInput;
                const packageOne = packages[0];
                //@ts-ignore
                let {deliveryCost, discount} = computeDiscountAndDeliveryCost(packageOne, baseDeliveryCost);

                //@ts-ignore
                let expectedRawDeliveryCost = computeExpectedDeliveryCost(packageOne, pricingData, baseDeliveryCost);
                let expectedDiscount = expectedRawDeliveryCost * computeDiscountRate(packageOne, pricingData);
                let expectedDeliveryCost = _.round(expectedRawDeliveryCost - expectedDiscount, 2);

                expect(deliveryCost).toBe(expectedDeliveryCost);
            });
        };

        rates.forEach(rate => {
            //@ts-ignore
            getPricingData.mockImplementation(() => (rate)) && computeForGivenRates();
        });

    });

    describe("Offer Code Discount Calculations", ()=>{
        const pricingDataOfferCodeConditionScenarios = [{
            itShould: "should compute discount correctly WHEN ONLY minDistance condition is defined for a valid coupon",
            conditions: {"minDistance": 30},
            discountExpected: true
        }, {
            itShould: "should compute discount correctly WHEN ONLY minWeight condition is defined for a valid coupon",
            conditions: {"minWeight": 50},
            discountExpected: true
        }, {
            itShould: "should compute discount correctly WHEN ONLY minDistance and minWeight conditions are defined for a valid coupon",
            conditions: {"minDistance": 30, "minWeight": 50},
            discountExpected: true
        }, {
            itShould: "should compute discount correctly WHEN ONLY maxDistance condition is defined for a valid coupon",
            conditions: {"maxDistance": 30},
            discountExpected: true
        }, {
            itShould: "should compute discount correctly WHEN ONLY maxWeight condition is defined for a valid coupon",
            conditions: {"maxWeight": 50},
            discountExpected: true
        }, {
            itShould: "should compute discount correctly WHEN ONLY maxDistance and maxWeight conditions are defined for a valid coupon",
            conditions: {"maxDistance": 30, "maxWeight": 50},
            discountExpected: true
        }, {
            itShould: "should compute discount correctly WHEN ONLY minDistance and maxDistance conditions are defined for a valid coupon",
            conditions: {"minDistance": 30, "maxDistance": 30},
            discountExpected: true
        }, {
            itShould: "should compute discount correctly WHEN ONLY minWeight and maxWeight conditions are defined for a valid coupon",
            conditions: {"minWeight": 50, "maxWeight": 50},
            discountExpected: true
        }, {
            itShould: "should compute discount correctly WHEN ONLY minDistance and minWeight conditions are defined for a valid coupon",
            conditions: {"maxDistance": 50, "minWeight": 50},
            discountExpected: true
        },
            //conditions not met
            {
                itShould: "should compute discount correctly WHEN ONLY minDistance condition is defined for a valid coupon [conditions not met]",
                conditions: {"minDistance": 31}
            }, {
                itShould: "should compute discount correctly WHEN ONLY minWeight condition is defined for a valid coupon [conditions not met]",
                conditions: {"minWeight": 51}
            }, {
                itShould: "should compute discount correctly WHEN ONLY minDistance and minWeight conditions are defined for a valid coupon [conditions not met]",
                conditions: {"minDistance": 31, "minWeight": 10}
            }, {
                itShould: "should compute discount correctly WHEN ONLY maxDistance condition is defined for a valid coupon [conditions not met]",
                conditions: {"maxDistance": 29}
            }, {
                itShould: "should compute discount correctly WHEN ONLY maxWeight condition is defined for a valid coupon [conditions not met]",
                conditions: {"maxWeight": 49}
            }, {
                itShould: "should compute discount correctly WHEN ONLY maxDistance and maxWeight conditions are defined for a valid coupon [conditions not met]",
                conditions: {"maxDistance": 29, "maxWeight": 60}
            }, {
                itShould: "should compute discount correctly WHEN ONLY minDistance and maxDistance conditions are defined for a valid coupon [conditions not met]",
                conditions: {"minDistance": 10, "maxDistance": 29}
            }, {
                itShould: "should compute discount correctly WHEN ONLY minWeight and maxWeight conditions are defined for a valid coupon [conditions not met]",
                conditions: {"minWeight": 51, "maxWeight": 60}
            }, {
                itShould: "should compute discount correctly WHEN ONLY minDistance and minWeight conditions are defined for a valid coupon [conditions not met]",
                conditions: {"maxDistance": 31, "minWeight": 51}
            }]
        describe("should calculate correctly for various conditions defined on an offer code", () => {
            function testDiscountCodeScenarios(scenario: {itShould: string, conditions: object, discountExpected?: boolean}) {
                it(scenario.itShould, ()=>{
                    const pricingData: PricingData = {
                        "rate_per_kg": 100,
                        "rate_per_km": 100,
                        "coupons": {
                            "OFR001": {
                                "discount_percent": 50,
                                "conditions": scenario.conditions
                            }
                        }
                    };

                    //@ts-ignore
                    getPricingData.mockImplementation(() => pricingData);

                    const {
                        discount,
                        expectedDiscount
                    } = getActualAndExpectedCostCalculations(pricingData);

                    if (scenario.discountExpected){
                        expect(discount).toBe(expectedDiscount);
                    } else {
                        expect(discount).toBe(0);
                    }
                });
            }

            pricingDataOfferCodeConditionScenarios.forEach((scenario) => {
                testDiscountCodeScenarios(scenario);
            });
        });

        describe("should calculate no discount for an invalid offer code", () => {
            function testDiscountCodeScenarios(scenario: {itShould: string, conditions: object, discountExpected?: boolean}) {
                it(scenario.itShould, ()=>{
                    const pricingData: PricingData = {
                        "rate_per_kg": 100,
                        "rate_per_km": 100,
                        "coupons": {
                            // Simulating some available offer code in the provided pricing data
                            // but package (packageOne) doesn't have applied with the available offer code
                            "VALID_OFFER_CODE": {
                                "discount_percent": 50,
                                "conditions": scenario.conditions
                            }
                        }
                    };

                    //@ts-ignore
                    getPricingData.mockImplementation(() => pricingData);

                    const {
                        discount,
                    } = getActualAndExpectedCostCalculations(pricingData);

                    expect(discount).toBe(0);
                });
            }

            pricingDataOfferCodeConditionScenarios.forEach((scenario) => {
                testDiscountCodeScenarios(scenario);
            });
        });
    })

});

describe("Logging Results to console are proper", ()=>{
    it("should log in expected format", ()=>{
        const packages = [packageOne];
        const resPackages = totalDeliveryCost(packages, baseDeliveryCost);

        console.log = jest.fn();
        printDeliveryCostResults(packages);
        //@ts-ignore
        expect(console.log.mock.calls[0][0]).toBe(`${packageOne.id} ${_.get(resPackages, '[0].discount')} ${_.get(resPackages, '[0].deliveryCost')}`);
    })
})

jest.mock('../src/pricingDataFileParser', () => ({
    ...jest.requireActual('../src/pricingDataFileParser'),
    getPricingData: jest.fn(),
}));


const packageOne = {
    id: "PKG1",
    weight: 50,
    distance: 30,
    couponCode: "OFR001",
    index: 0
};

const baseDeliveryCost = 100;

const getActualAndExpectedCostCalculations = (pricingData: PricingData) => {
    let {deliveryCost, discount} = computeDiscountAndDeliveryCost(packageOne, baseDeliveryCost);

    //@ts-ignore
    let expectedRawDeliveryCost = computeExpectedDeliveryCost(packageOne, pricingData, baseDeliveryCost);
    let expectedDiscount = expectedRawDeliveryCost * computeDiscountRate(packageOne, pricingData);
    let expectedDeliveryCost = _.round(expectedRawDeliveryCost - expectedDiscount, 2);

    return {deliveryCost, expectedDeliveryCost, discount, expectedDiscount}
}

const computeExpectedDeliveryCost = (pkg: PackageInfo, pricingData: PricingData, baseDeliveryCost: number) => {
    const pricePerKG = _.get(pricingData, "rate_per_kg", DEFAULT_RATE_PER_KG);
    const pricePerKM = _.get(pricingData, "rate_per_km", DEFAULT_RATE_PER_KM);
    return baseDeliveryCost + (pkg.weight * pricePerKG) + (pkg.distance * pricePerKM);
}

const computeDiscountRate = (pkg: PackageInfo, pricingData: PricingData) => {
    const availableCoupons = pricingData?.coupons;
    let discountRate = 0;
    const couponCodeAppliedOnPackage = pkg.couponCode;
    if (availableCoupons) {
        const couponData: Coupon = availableCoupons[couponCodeAppliedOnPackage];
        if (couponData) {
            let conditionMet = null;
            for (let condition in couponData.conditions) {
                if (condition === 'minDistance') {
                    conditionMet = pkg.distance >= couponData.conditions[condition]!
                } else if (condition === 'maxDistance') {
                    conditionMet = pkg.distance <= couponData.conditions[condition]!
                } else if (condition === 'minWeight') {
                    conditionMet = pkg.weight >= couponData.conditions[condition]!
                } else if (condition === 'maxWeight') {
                    conditionMet = pkg.weight <= couponData.conditions[condition]!
                } else {
                    conditionMet = false;
                }
                if (conditionMet === false) {
                    break;
                }
            }
            if (conditionMet) {
                discountRate = couponData.discount_percent / 100;
            }
        }
    }
    return discountRate;
}