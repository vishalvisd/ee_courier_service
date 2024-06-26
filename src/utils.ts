import _ from "lodash";
import {NOT_AVAILABLE} from "./constants.js";

const knapsack = (packageWeights: Array<number>, maxCapacity: number):Array<number>=>{
    const numberOfPackages = _.size(packageWeights);
    const wv = Array.from({ length: numberOfPackages + 1 }, () => Array(maxCapacity + 1).fill(0));

    for (let i = 0; i < numberOfPackages; i++) {
        for (let j = 1; j <= maxCapacity; j++) {
            if (packageWeights[i] <= j) {
                wv[i+1][j] = Math.max(wv[i][j], wv[i][j - packageWeights[i]] + packageWeights[i]);
            } else {
                wv[i+1][j] = wv[i][j];
            }
        }
    }

    let selectedItems = [];
    let bucketCapacity = maxCapacity;
    for (let i = numberOfPackages; i > 0; i--) {
        if (wv[i][bucketCapacity] !== wv[i - 1][bucketCapacity]) {
            selectedItems.push(i - 1);
            bucketCapacity -= packageWeights[i - 1];
        }
    }
    return selectedItems;
};

const printableNumber = (value: string)=>{
    let numeric:string|number = NOT_AVAILABLE;

    if (value !== ""){
        const toNum = _.toNumber(value);
        if (!_.isNaN(toNum) && _.isFinite(toNum)) numeric = toNum;
    }
    return numeric;
}

const logErrorMessageAndExitProgram = (message: string)=>{
    console.error(`Error: ${message}`);
    process.exit();
}

export {
    knapsack,
    logErrorMessageAndExitProgram,
    printableNumber
}