import _ from "lodash";
import inquirer from 'inquirer';
import { exec } from "node:child_process";
import userInputParser from "./userInputParser.js";
import totalDeliveryCost, { printResultsToConsole as printDeliveryCostResults } from "./totalDeliveryCost.js";
import estimatedDeliveryTime, { printResultsToConsole as printDeliveryTimeResults } from "./estimatedDeliveryTime.js";
const AVAILABLE_PROGRAMS = {
    TOTAL_DELIVERY_COST: "Total Delivery Cost",
    ESTIMATE_DELIVERY_TIME: "Estimated Delivery Time",
    RUN_TESTS: "Run Tests"
};
const getProgramSelectionFromUser = () => {
    const inputName = "userInput";
    const inquireInput = {
        type: "list",
        name: inputName,
        message: "Select Program:",
        choices: _.values(AVAILABLE_PROGRAMS)
    };
    return inquirer.prompt([inquireInput]).then(v => v[inputName]);
};
const getFromUser = (message, inputType = "input") => {
    const inputName = "userInput";
    const inquireInput = {
        type: inputType,
        name: inputName,
        message: message,
        choices: _.values(AVAILABLE_PROGRAMS)
    };
    return inquirer.prompt([inquireInput]).then(v => v[inputName]);
};
const selectedProgram = await getProgramSelectionFromUser();
if (selectedProgram === AVAILABLE_PROGRAMS.RUN_TESTS) {
    exec(`npm run test`).stdout.pipe(process.stdout);
}
else {
    let programInput = '';
    const baseDeliveryCostAndNumberOfPackages = await getFromUser("Base Delivery Cost and Number of Packages [base_delivery_cost no_of_packges]:");
    programInput += `${baseDeliveryCostAndNumberOfPackages}\n`;
    const numberOfPackages = _.toNumber(_.split(baseDeliveryCostAndNumberOfPackages, /\s+/)[1]);
    for (let i = 0; i < numberOfPackages; i++) {
        const packageInfo = await getFromUser(`#${i + 1}/${numberOfPackages} Package Info [pkg_id1 pkg_weight1_in_kg distance1_in_km offer_code1]:`);
        programInput += `${packageInfo}\n`;
    }
    if (selectedProgram === AVAILABLE_PROGRAMS.ESTIMATE_DELIVERY_TIME) {
        const fleetInfo = await getFromUser("Fleet Info [no_of_vehicles max_speed max_carriable_weight]:");
        programInput += `${fleetInfo}\n`;
    }
    const parsedInput = userInputParser(programInput);
    console.log("=RESULT==========");
    if (selectedProgram === AVAILABLE_PROGRAMS.TOTAL_DELIVERY_COST) {
        const packages = totalDeliveryCost(parsedInput.packages, parsedInput.baseDeliveryCost);
        printDeliveryCostResults(packages);
    }
    if (selectedProgram === AVAILABLE_PROGRAMS.ESTIMATE_DELIVERY_TIME) {
        if (parsedInput.fleetInfo) {
            const packages = estimatedDeliveryTime(parsedInput.packages, parsedInput.fleetInfo, parsedInput.baseDeliveryCost);
            printDeliveryTimeResults(packages);
        }
        else {
            console.log("Fleet Information is required to estimate delivery time");
        }
    }
}
//# sourceMappingURL=index.js.map