import path from "node:path";
import _ from "lodash";
import fs from "node:fs";
import {PricingData} from "./types.js";
import {DEFAULT_PRICING_FILE_PATH, PRICING_FILE_PATH_ENVIRONMENT_VARIABLE} from "./constants.js";
import {logErrorMessageAndExitProgram} from "./utils.js";
import pricingSchema, {ajv} from "./pricingSchema.js";

const DEFAULT_PRICINGDATA_FILE_PATH = DEFAULT_PRICING_FILE_PATH;
const PRICING_FILE_PATH_OPTION = '-p';

let pricingData:PricingData | null = null;
console.log("Default pricing data file path:", DEFAULT_PRICINGDATA_FILE_PATH);

export function getPricingData():PricingData | null {
    return pricingData;
}

const readPricingDataFile = (path: string): PricingData | undefined => {
    try {
        // Read the file from metaFilePath synchronously and validate the schema
        const jsonContents = fs.readFileSync(path, 'utf-8');
        const parsedJsonContents:PricingData = JSON.parse(jsonContents);
        const isValidJson = ajv.validate(pricingSchema, parsedJsonContents);

        if (!isValidJson) {
            const errorMessage = `Invalid data format. JSON file: ${path}
                ${_.reduce(ajv.errors, (acc, v) => {
                acc += `=> ${v.instancePath}: ${v.message}`;
                return acc;
            }, "")}
                Please correct, else, remove the file argument to use default`.split("\n").map(s => s.trim()).join("\n");
            logErrorMessageAndExitProgram(errorMessage);
        }
        Object.freeze(parsedJsonContents);
        return parsedJsonContents;
    } catch (e: unknown) {
        logErrorMessageAndExitProgram(`Error parsing JSON metafile ${path}\n${e?.toString()}`);
    }
}

export default function () {
    pricingData = null;

    let metaFilePath = null;
    if (_.get(process.argv, '[2]', null) === PRICING_FILE_PATH_OPTION) {
        metaFilePath = _.get(process.argv, '[3]', '') as string;
        pricingData = readPricingDataFile(metaFilePath)!;
    } else if (fs.existsSync(DEFAULT_PRICINGDATA_FILE_PATH)) {
        // check if the pricing data file is at the process root location
        console.log(`Using Pricing data file [default path] ${DEFAULT_PRICINGDATA_FILE_PATH}`)
        pricingData = readPricingDataFile(DEFAULT_PRICINGDATA_FILE_PATH)!;
    } else if (process.env[PRICING_FILE_PATH_ENVIRONMENT_VARIABLE]) {
        // check if the pricing data file path is defined as environment variable
        console.log("Using Pricing data file path from environment variable 'PRICING_FILE'")
        pricingData = readPricingDataFile(process.env[PRICING_FILE_PATH_ENVIRONMENT_VARIABLE])!;
    } else {
        console.log("No pricing data file provided. Default pricing values will be used!")
    }
}
