import _ from "lodash";
import inquirer from 'inquirer';
import {InquireQuestion, ParsedUserInput} from "./types.js";
import userInputParser from "./userInputParser.js";
import totalDeliveryCost, {printResultsToConsole as printDeliveryCostResults} from "./totalDeliveryCost.js";
import estimatedDeliveryTime, {printResultsToConsole as printDeliveryTimeResults} from "./estimatedDeliveryTime.js";
import parsePricingDataFile from "./pricingDataFileParser.js";

parsePricingDataFile();

const AVAILABLE_PROGRAMS = {
    TOTAL_DELIVERY_COST: "Total Delivery Cost",
    ESTIMATE_DELIVERY_TIME: "Estimated Delivery Time"
};

const AVAILABLE_INPUT_METHODS = {
    EDITOR: "Editor - provide input in bulk",
    CMD: "Provide via command line"
}

type INQUIRE_INPUT_TYPES = "input" | "editor" | "list"

const getFromUser = (message: string, inputType: INQUIRE_INPUT_TYPES = "input", choiceValues?: Array<string>):Promise<string> => {
    const inputName = "userInput";
    const inquireInput: InquireQuestion = {
        type: inputType,
        name: inputName,
        message: message
    };
    if (inputType === "list") inquireInput.choices = choiceValues;
    return inquirer.prompt([inquireInput]).then(v => _.trim(v[inputName]));
}

const selectedProgram = await getFromUser("Select Program:", "list", _.values(AVAILABLE_PROGRAMS));
const selectedInputMethod = await getFromUser("Select Input Method", "list", _.values(AVAILABLE_INPUT_METHODS))

let programInput = '';
if (selectedInputMethod === AVAILABLE_INPUT_METHODS.EDITOR){
    programInput = await getFromUser("Please enter to input into default editor", "editor")
} else {
    const baseDeliveryCostAndNumberOfPackages = await getFromUser("Base Delivery Cost and Number of Packages [base_delivery_cost no_of_packges]:");
    programInput += `${baseDeliveryCostAndNumberOfPackages}\n`;

    const numberOfPackages = _.toNumber(_.split(baseDeliveryCostAndNumberOfPackages, /\s+/)[1]);
    for (let i = 0; i < numberOfPackages; i++){
        const packageInfo = await getFromUser(`#${i+1}/${numberOfPackages} Package Info [pkg_id1 pkg_weight1_in_kg distance1_in_km offer_code1]:`);
        programInput += `${packageInfo}\n`;
    }

    if (selectedProgram === AVAILABLE_PROGRAMS.ESTIMATE_DELIVERY_TIME) {
        const fleetInfo = await getFromUser("Fleet Info [no_of_vehicles max_speed max_carriable_weight]:");
        programInput += `${fleetInfo}\n`;
    }
}

const parsedInput:ParsedUserInput = userInputParser(programInput);
console.log("=RESULT==========");
if (selectedProgram === AVAILABLE_PROGRAMS.TOTAL_DELIVERY_COST) {
    const packages = totalDeliveryCost(parsedInput.packages, parsedInput.baseDeliveryCost);
    printDeliveryCostResults(packages);
}

if (selectedProgram === AVAILABLE_PROGRAMS.ESTIMATE_DELIVERY_TIME) {
    if (parsedInput.fleetInfo){
        const packages = estimatedDeliveryTime(parsedInput.packages, parsedInput.fleetInfo, parsedInput.baseDeliveryCost);
        printDeliveryTimeResults(packages);
    } else {
        console.log("Fleet Information is required to estimate delivery time");
    }
}
