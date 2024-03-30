import _ from 'lodash';
import {knapsack, logErrorMessageAndExitProgram, printableNumber} from "../src/utils.js";

describe("Order of delivery functionality", ()=>{
    describe("Order of Package Delivery", ()=>{
        let packageWeights = [50, 75, 175, 110, 155];
        const maxCapacity = 200;
        let selection: Array<number> = [];
        afterEach(()=>{
            _.remove(packageWeights, (_v, index) =>{
                return selection.includes(index)
            })
        })
        it("selects the right weights combination in the first iteration", ()=>{
            selection = knapsack(packageWeights, maxCapacity);

            expect(selection.sort()).toEqual([1, 3]);
        })

        it("selects the right weights combination in the second iteration", ()=>{
            selection = knapsack(packageWeights, maxCapacity);
            expect(selection.sort()).toEqual([1]);
        })

        it("selects the right weights combination in the third iteration", ()=>{
            selection = knapsack(packageWeights, maxCapacity);
            expect(selection.sort()).toEqual([1]);
        })

        it("selects the right weights combination in the fourth iteration", ()=>{
            selection = knapsack(packageWeights, maxCapacity);
            expect(selection.sort()).toEqual([0]);
        })
    });
});

describe("Log and exit functionality", ()=>{
    it("should log given message and exit the program", ()=>{
        const logMessage = "Test Error message";

        //@ts-ignore
        const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
        console.error = jest.fn();

        logErrorMessageAndExitProgram(logMessage);

        //@ts-ignore
        expect(console.error.mock.calls[0][0]).toBe(`Error: ${logMessage}`);
        expect(mockExit).toHaveBeenCalled();
    });

    afterEach(()=>{
        jest.clearAllMocks();
    })
});

describe("Pritable number function", ()=>{
    it("should return 'N/A' for non numberic value", ()=>{
        const badNumbers = ['undefined', 'null', '-Infinity', 'Infinity', '', 'NaN'];
        badNumbers.forEach(badNumber => {
            const returnVal = printableNumber(badNumber);
            expect(returnVal).toEqual('N/A');
        })
    })
})