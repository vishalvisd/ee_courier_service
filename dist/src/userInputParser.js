import _ from "lodash";
const verifyAndParseNumeric = (val) => {
    const numericVal = _.toNumber(val);
    if (!_.isNaN(numericVal)) {
        return numericVal;
    }
    throw new Error(`Failed to parse, expected Numeric value ${val}`);
};
const sanitizeLines = (lines) => _.reduce(lines, (acc, line) => {
    if (_.trim(line).length > 0)
        acc.push(line);
    return acc;
}, []);
export default function (input) {
    try {
        const lines = sanitizeLines(_.split(input, "\n"));
        const splittedValues = _.split(lines[0], /\s+/);
        const baseDeliveryCost = verifyAndParseNumeric(splittedValues[0]);
        const numOfPackages = verifyAndParseNumeric(splittedValues[1]);
        // Check if we have got input for all the asked number of packages
        const packages = Array(numOfPackages).fill(0).map((pkg, index) => {
            const packageInfoLine = lines[index + 1];
            const splittedValues = _.split(packageInfoLine, /\s+/);
            return {
                index,
                id: splittedValues[0],
                weight: verifyAndParseNumeric(splittedValues[1]),
                distance: verifyAndParseNumeric(splittedValues[2]),
                couponCode: splittedValues[3]
            };
        });
        let fleetInfo = null;
        if (_.size(lines) >= numOfPackages + 2) {
            const fleetInfoLine = lines[numOfPackages + 1];
            const splittedValues = _.split(fleetInfoLine, /\s+/);
            fleetInfo = {
                num: verifyAndParseNumeric(splittedValues[0]),
                speed: verifyAndParseNumeric(splittedValues[1]),
                maxWeight: verifyAndParseNumeric(splittedValues[2]),
            };
        }
        return {
            baseDeliveryCost,
            packages,
            fleetInfo
        };
    }
    catch (err) {
        throw new Error(`Input Parsing failed: ${err}`);
    }
}
//# sourceMappingURL=userInputParser.js.map