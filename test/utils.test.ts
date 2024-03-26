import _ from 'lodash';
import {knapsack} from "../src/utils";

describe("Core Functionality", ()=>{
    describe("Order of Package Delivery", ()=>{
        let packageWeights = [50, 75, 175, 110, 155];
        const maxCapacity = 200;
        let selection = [];
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
})