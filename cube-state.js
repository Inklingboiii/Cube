import turnMaps from "./turnMaps";
function createCubeState() {
    /*
    0 = top / white
    1 = front / green
    2 = bottom / yellow
    3 = back / blue
    4 = right / red
    5 = left / orange
    */
    return [
        [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ],
        [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1]
        ],
        [
            [2, 2, 2],
            [2, 2, 2],
            [2, 2, 2]
        ],
        [
            [3, 3, 3],
            [3, 3, 3],
            [3, 3, 3]
        ],
        [
            [4, 4, 4],
            [4, 4, 4],
            [4, 4, 4]
        ],
        [
            [5, 5, 5],
            [5, 5, 5],
            [5, 5, 5]
        ],
        
    ];
}

let colorMap = [0xffffff, 0x33FF33, 0xffdd33, 0x3344ff, 0xff0000, 0xff8833];

function turnWithMap(state, translationMap, amount=1) {
    for (let i = 0; i < amount; i++) {
        let stateCopy = JSON.parse(JSON.stringify(state));
        state = state.map((side, sideIndex) => side.map((row, rowIndex) => row.map((cell, cellIndex) => {
            let newIndices = translationMap[sideIndex][rowIndex][cellIndex];
            return stateCopy[newIndices[0]][newIndices[1]][newIndices[2]]
        })));
    }
    return state
}

function generateRandomState(state) {
    // https://stackoverflow.com/questions/2532218/pick-random-property-from-a-javascript-object
    let possibleTurns = Object.keys(turnMaps);
    let turnsList = [];
    for (let i = 0; i < 2; i++) {
        let turnKey = possibleTurns[Math.floor(possibleTurns.length * Math.random())];
        let amount = Math.floor(Math.random() * 3) + 1;
        state = turnWithMap(state, turnMaps[turnKey], amount)
        turnsList.push(`${turnKey}${amount === 3 ? '\'' : amount === 2 ? '2' : ''}`);
    }
    console.log(turnsList.join(" "))
    return state;
}

function solveState(state) {
    let solvedState = createCubeState()
    let statesQueue = new Set();
    statesQueue.add(state);
    let currentState = [...statesQueue][0]
    let solvedStateFound = false;
    for (let i = 0; i < 30; i++) {
        if(solvedStateFound) break;
        currentState = [...statesQueue][0];
        turnLoop:
        for (const turnKey in turnMaps) {
            for (let i = 0; i < 3; i++) {
                let newState = turnWithMap(currentState, turnMaps[turnKey], i+1)
                statesQueue.add(newState);
                console.log(turnKey, i+1)
               // console.table(newState)
                if (JSON.stringify(newState) === JSON.stringify(solvedState)) {
                    console.log("found")
                    solvedStateFound = true;
                    break turnLoop;
                }
            }
        }
    }
}
export {createCubeState, colorMap, turnWithMap, generateRandomState, solveState}