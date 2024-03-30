import _ from "lodash";
import fs from 'node:fs';
import path from "node:path";
import parsePricingData, {getPricingData} from "../src/pricingDataFileParser.js";
import pricingSchema, {ajv} from "../src/pricingSchema.js";
import {logErrorMessageAndExitProgram} from "../src/utils.js";
import {DEFAULT_PRICING_FILE_PATH, PRICING_FILE_PATH_ENVIRONMENT_VARIABLE} from "../src/constants.js";

describe("User provided Pricing Data Json file parsing functionality", ()=>{
    // With 'pricingSchema.ts' file, we are already validating the provided pricing file's JSON contents
    // Now, all we need to do is verify whether we are actively using the schema file or not for doing the validation
    it("should be using pricingSchema to validate the provided pricing JSON file", ()=>{
        const pricingData = {
            "rate_per_km": 100,
            "rate_per_kg": 100
        }
        createFileAndSetNodeArgs(pricingData);

        const ajvValidate = ajv.validate;
        //@ts-ignore
        ajv.validate = jest.fn();
        //@ts-ignore
        ajv.validate.mockImplementation(()=>{
            return true;
        })
        parsePricingData();
        expect(ajv.validate).toHaveBeenCalledWith(pricingSchema, pricingData);
        ajv.validate = ajvValidate;
    });

    it("should fail if rate_per_km or rate_per_kg are missing", ()=>{
        const pricingData = {
            "rate_per_kg": 100
        };

        createFileAndSetNodeArgs(pricingData);
        parsePricingData()
        expect(logErrorMessageAndExitProgram).toHaveBeenCalledTimes(1);

        //@ts-ignore
        pricingData["rate_per_km"] = 100;
        //@ts-ignore
        delete pricingData.rate_per_kg;

        createFileAndSetNodeArgs(pricingData);
        parsePricingData()
        expect(logErrorMessageAndExitProgram).toHaveBeenCalledTimes(2);

    });

    it("should work without coupons section", ()=>{
        const pricingData = {
            "rate_per_kg": 100,
            "rate_per_km": 100
        };

        createFileAndSetNodeArgs(pricingData);

        parsePricingData()
        expect(logErrorMessageAndExitProgram).not.toHaveBeenCalled();
    })

    it("if coupon section is defined then there must be at least one copuon defined", ()=>{
        const pricingData = {
            "rate_per_kg": 100,
            "rate_per_km": 100,
            "coupons": {}
        };
        createFileAndSetNodeArgs(pricingData);

        parsePricingData()
        expect(logErrorMessageAndExitProgram).toHaveBeenCalled();
    })

    it("should allow ONLY min weight condition on offer code, and work fine even if no other conditions are defined", ()=>{
        const pricingData = {
            "rate_per_kg": 100,
            "rate_per_km": 100,
            "coupons": {
                "OFR001": {
                    "discount_percent": 100,
                    "conditions": {
                        "minWeight": 0
                    }
                }
            }
        };

        createFileAndSetNodeArgs(pricingData);

        parsePricingData()
        expect(logErrorMessageAndExitProgram).not.toHaveBeenCalled();
    });

    it("should allow ONLY min distance condition on offer code, and work fine even if no other conditions are defined", ()=>{
        const pricingData = {
            "rate_per_kg": 100,
            "rate_per_km": 100,
            "coupons": {
                "OFR001": {
                    "discount_percent": 100,
                    "conditions": {
                        "minDistance": 0
                    }
                }
            }
        };

        createFileAndSetNodeArgs(pricingData);

        parsePricingData()
        expect(logErrorMessageAndExitProgram).not.toHaveBeenCalled();
    })

    it("should allow ONLY min distance and min weight on offer code and work fine even if no other conditions are defined", ()=>{
        const pricingData = {
            "rate_per_kg": 100,
            "rate_per_km": 100,
            "coupons": {
                "OFR001": {
                    "discount_percent": 100,
                    "conditions": {
                        "minWeight": 0,
                        "minDistance": 0
                    }
                }
            }
        };

        createFileAndSetNodeArgs(pricingData);

        parsePricingData()
        expect(logErrorMessageAndExitProgram).not.toHaveBeenCalled();
    })
    it("should allow ONLY min and max distance condition on offer code, even if min/max weight are not provided", ()=>{
        const pricingData = {
            "rate_per_kg": 100,
            "rate_per_km": 100,
            "coupons": {
                "OFR001": {
                    "discount_percent": 100,
                    "conditions": {
                        "minDistance": 0,
                        "maxDistance": 0
                    }
                }
            }
        };

        createFileAndSetNodeArgs(pricingData);

        parsePricingData()
        expect(logErrorMessageAndExitProgram).not.toHaveBeenCalled();
    })

    it("should allow ONLY min and max weight condition on offer code, even if min/max distance are not provided", ()=>{
        const pricingData = {
            "rate_per_kg": 100,
            "rate_per_km": 100,
            "coupons": {
                "OFR001": {
                    "discount_percent": 100,
                    "conditions": {
                        "minWeight": 0,
                        "maxWeight": 0
                    }
                }
            }
        };

        createFileAndSetNodeArgs(pricingData);

        parsePricingData()
        expect(logErrorMessageAndExitProgram).not.toHaveBeenCalled();
    });

    // it ("shoudl only max distance
    // it shoud only max weight
    // it should only max distance

    it("should not allow if a coupon do not have discount percent defined", ()=> {
        const pricingData = {
            "rate_per_kg": 100,
            "rate_per_km": 100,
            "coupons": {
                "OFR001": {
                    "conditions": {
                        "minWeight": 0
                    }
                }
            }
        };

        createFileAndSetNodeArgs(pricingData);

        parsePricingData()
        expect(logErrorMessageAndExitProgram).toHaveBeenCalled();
    })
    afterEach(()=>{
        jest.clearAllMocks();
    })
    afterAll(()=> {
        // Delete the temporary pricing file created for test purpose
        fs.rmSync(testPricingFilePath);
    });
});

describe("Improper formatted JSON file causes program to exit", ()=>{
    it('should exit program when bad formatted pricing file is provided', ()=>{
        fs.writeFileSync(testPricingFilePath, "bad format file");

        process.argv[2] = '-p';
        process.argv[3] = testPricingFilePath;

        parsePricingData()
        expect(logErrorMessageAndExitProgram).toHaveBeenCalled();
    });

    it("should exit program when unknown args used while running the program", ()=>{
        const pricingData = {
            "rate_per_kg": 100,
            "rate_per_km": 100
        };
        createFileAndSetNodeArgs(pricingData);

        process.argv[2] = '-u'; // Unknown argument

        parsePricingData()
        expect(logErrorMessageAndExitProgram).toHaveBeenCalled();
    })

    afterAll(()=> {
        // Delete the temporary pricing file created for test purpose
        fs.rmSync(testPricingFilePath);
    });
});

describe("Read Pricing file from various locations in expected order", ()=>{
    it("should read pricing data file from node arguments if provided", ()=>{
        const pricingData = {
            "rate_per_kg": _.random(121, 7656),
            "rate_per_km": _.random(121, 7656)
        };

        createFileAndSetNodeArgs(pricingData);
        parsePricingData();
        const retrievedPricingData = getPricingData();

        expect(retrievedPricingData?.toString()).toEqual(pricingData.toString());
    });

    it("should read pricing data file from default location if " +
        "pricing file is not provided via node arguments", ()=>{
        const pricingData = {
            "rate_per_kg": _.random(121, 7656),
            "rate_per_km": _.random(121, 7656)
        };
        createFileAndSetNodeArgs(pricingData, DEFAULT_PRICING_FILE_PATH);
        process.argv = process.argv.slice(0,2);
        parsePricingData();

        // Delete the temporary pricing file created for test purpose
        fs.rmSync(DEFAULT_PRICING_FILE_PATH);

        const retrievedPricingData = getPricingData();

        expect(retrievedPricingData?.toString()).toEqual(pricingData.toString());
    })

    it("should read pricing data file environment variable if " +
        "default location does not have the file and if pricing file " +
        "is not provided via node arguments", ()=>{
        const pricingData = {
            "rate_per_kg": _.random(121, 7656),
            "rate_per_km": _.random(121, 7656)
        };

        const filePath = path.join(process.cwd(), "fileProvidedViaEnv.json");
        createFileAndSetNodeArgs(pricingData, filePath);
        process.argv = process.argv.slice(0,2);
        process.env[PRICING_FILE_PATH_ENVIRONMENT_VARIABLE] = filePath;
        parsePricingData();

        // Delete the temporary pricing file created for test purpose
        fs.rmSync(filePath);
        delete process.env[PRICING_FILE_PATH_ENVIRONMENT_VARIABLE];

        const retrievedPricingData = getPricingData();

        expect(retrievedPricingData?.toString()).toEqual(pricingData.toString());
    });

    it("should have pricing data as null if Pricing file cannot be resolved from" +
        "either node parameters, default path and node parameters", ()=>{
        process.argv = process.argv.slice(0,2);
        parsePricingData();
        const retrievedPricingData = getPricingData();

        expect(retrievedPricingData).toEqual(null);
    });

    let defaultFileBackupContents = '';
    beforeEach(()=>{
        // Take Backup of existing default pricing data file
        // Read file if present
        const defaultFileExits = fs.existsSync(DEFAULT_PRICING_FILE_PATH);
        if (defaultFileExits){
            defaultFileBackupContents = fs.readFileSync(DEFAULT_PRICING_FILE_PATH, 'utf-8');
            fs.rmSync(DEFAULT_PRICING_FILE_PATH);
        }
    });
    afterEach(()=>{
        // Restore default file if backup exists
        if (defaultFileBackupContents){
            fs.writeFileSync(DEFAULT_PRICING_FILE_PATH, defaultFileBackupContents);
        }
    })
    afterAll(()=> {
        // Delete the temporary pricing file created for test purpose
        if (fs.existsSync(testPricingFilePath)) fs.rmSync(testPricingFilePath);
    })
})

jest.mock('../src/utils', () => ({
    ...jest.requireActual('../src/utils'),
    logErrorMessageAndExitProgram: jest.fn(),
}));
//@ts-ignore
logErrorMessageAndExitProgram.mockImplementation(() => {});

const testPricingFilePath = `${process.cwd()}/_test_pricing.json`;
const createFileAndSetNodeArgs = (jsonData: {}, filePath = testPricingFilePath)=>{
    const fileData = JSON.stringify(jsonData);
    // Write the temporary pricing file for test purpose
    fs.writeFileSync(filePath, fileData);

    process.argv[2] = '-p';
    process.argv[3] = filePath;
}
