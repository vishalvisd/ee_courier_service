import _ from "lodash";
const knapsack = (packageWeights, maxCapacity) => {
    const numberOfPackages = _.size(packageWeights);
    const wv = Array.from({ length: numberOfPackages + 1 }, () => Array(maxCapacity + 1).fill(0));
    for (let i = 0; i < numberOfPackages; i++) {
        for (let j = 1; j <= maxCapacity; j++) {
            if (packageWeights[i] <= j) {
                wv[i + 1][j] = Math.max(wv[i][j], wv[i][j - packageWeights[i]] + packageWeights[i]);
            }
            else {
                wv[i + 1][j] = wv[i][j];
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
export { knapsack };
//# sourceMappingURL=utils.js.map