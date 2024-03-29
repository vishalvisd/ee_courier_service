import userInputParser from "../src/userInputParser.js";

describe("User Input parse to take business defined user inputs only", ()=>{
    it("Input Parse should throw error for bad inputs", ()=>{
        const programInputs = [
            `100 1\npkg1 50 100`,
            `100 1\npkg1 50 100\n2 200 100`,
            // BAD VALUES
            `100 1\npkg1 0 100`,
            `100 1\npkg1 50 0`,
            `100 1\npkg1 0 0`,
            `1\npkg1 50 100`,
            ` 1\npkg1 50 100`,
            `100 1\npkg1 badVal 100`,
            `100 1\npkg1 50 badVal`,
            `100 1\npkg1 badVal badVal`,
            `100 1\npkg1 null 100`,
            `100 1\npkg1 100 null`,
            `100 1\npkg1 null null`,
            `100 1\npkg1 100 `,
            `100 1\npkg1 `,
            `100 1\npkg1`,
            `100 1\npkg1 -1 -1`,
            `100 1\npkg1 -1`,
            `100 1\npkg1 50 100\n0 200 100`,
            `100 1\npkg1 50 100\n-1 200 100`,
            `100 1\npkg1 50 100\n2 0 100`,
            `100 1\npkg1 50 100\n2 -1 100`,
            `100 1\npkg1 50 100\n2 200 0`,
            `100 1\npkg1 50 100\n2 200 -1`,
        ];

        const BAD_INPUT_START_INDEX = 2;

        programInputs.forEach((programInput, index) => {
            const t = ()=>{
                userInputParser(programInput);
            }
            if (index < BAD_INPUT_START_INDEX){
                expect(t).not.toThrow(Error);
            } else {
                expect(t).toThrow(Error);
            }
        })
    })
})