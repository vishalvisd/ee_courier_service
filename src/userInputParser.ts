import _ from "lodash";
import {PackageInfo, ParsedUserInput} from "./types.js";
import {logErrorMessageAndExitProgram} from "./utils.js";

const verifyAndParsePositiveNumeric = (val: string, includeZero = true):number | undefined =>{
    const numericVal = _.toNumber(val);
    if (!_.isNaN(numericVal) && val !== ""){
        if (numericVal < 0){
            logErrorMessageAndExitProgram(`Failed to parse, expected Numeric value -${val}, expected positive value!`)
        }
        if (numericVal === 0 && !includeZero){
            logErrorMessageAndExitProgram(`Failed to parse, expected Numeric value -${val} greater than 0!`)
        }
        return numericVal;
    }
    logErrorMessageAndExitProgram(`Failed to parse, expected Numeric value ${val}`)
}

const sanitizeUserInputLines = (lines:Array<string>) => _.reduce(lines, (acc:Array<string>, line)=>{
    if (_.trim(line).length > 0) acc.push(line);
    return acc;
}, [])

export default function (input:string):ParsedUserInput | undefined{
    const lines = sanitizeUserInputLines(_.split(input, "\n"));

    const splittedValues = _.split(lines[0], /\s+/);
    const baseDeliveryCost = verifyAndParsePositiveNumeric(splittedValues[0])!;
    const numOfPackages = verifyAndParsePositiveNumeric(splittedValues[1], false)!;

    // Check if we have got input for all the asked number of packages
    if (lines.length < numOfPackages + 1) logErrorMessageAndExitProgram("Insufficient Package data")
    // Set packages
    const packages:Array<PackageInfo> = Array(numOfPackages).fill(0).map((pkg, index) => {
        const packageInfoLine = lines[index+1]
        const splittedValues = _.split(packageInfoLine, /\s+/);
        return {
            index,
            id: splittedValues[0],
            weight: verifyAndParsePositiveNumeric(splittedValues[1], false)!,
            distance: verifyAndParsePositiveNumeric(splittedValues[2], false)!,
            couponCode: splittedValues[3]
        }
    });

    let fleetInfo = null;
    if (_.size(lines) >= numOfPackages+2){
        const fleetInfoLine = lines[numOfPackages+1];
        const splittedValues = _.split(fleetInfoLine, /\s+/);
        fleetInfo = {
            num: verifyAndParsePositiveNumeric(splittedValues[0], false)!,
            speed: verifyAndParsePositiveNumeric(splittedValues[1], false)!,
            maxWeight: verifyAndParsePositiveNumeric(splittedValues[2], false)!,
        }
    }

    return {
        baseDeliveryCost,
        packages,
        fleetInfo
    }
}
