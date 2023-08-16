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

function createCrossState() {
    return [
        [
            [-1, 0, -1],
            [-1, 0, -1],
            [-1, 0, -1]
        ],
        [
            [-1, 1, -1],
            [-1, 1, -1],
            [-1, -1, -1]
        ],
        [
            [-1, 2, -1],
            [-1, 2, -1],
            [-1, -1, -1]
        ],
        [
            [-1, 3, -1],
            [-1, 3, -1],
            [-1, -1, -1]
        ],
        [
            [-1, 4, -1],
            [-1, 4, -1],
            [-1, -1, -1]
        ],
        [
            [-1, 5, -1],
            [-1, 5, -1],
            [-1, -1, -1]
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
    for (let i = 0; i < 4; i++) {
        let turnKey = possibleTurns[Math.floor(possibleTurns.length * Math.random())];
        let amount = Math.floor(Math.random() * 3) + 1;
        state = turnWithMap(state, turnMaps[turnKey], amount)
        turnsList.push(`${turnKey}${amount === 3 ? '\'' : amount === 2 ? '2' : ''}`);
    }
    console.log(turnsList.join(" "))
    return state;
}

function solveState(state) {
    let solvedState = createCubeState();
    let statesQueue = [];
    let resolvedQueue = []
    resolvedQueue.push({turn: null,amount: 0, index: -1});
    let solvedStateFound = false;

    for (const turnKey in turnMaps) {
        for (let i = 0; i < 3; i++) {
            statesQueue.push({turn: turnKey, amount: i+1, index: 0});
        }
    }
    for (let i = 0; i < 100000; i++) {
        if(solvedStateFound) break;
        const referenceIndex = resolvedQueue.length;
        turnLoop:
        for (const turnKey in turnMaps) {
            if(statesQueue[0].turn === turnKey) continue;
            for (let i = 0; i < 3; i++) {
                let turnsList = []
                let currentNode = statesQueue[0]
                // Check if position is already om solved state before adding turns
                while(true) {
                    turnsList.push(currentNode);
                    currentNode = resolvedQueue[currentNode.index];
                    if(currentNode.index < 0) break;
                }
                let stateCopy = JSON.parse(JSON.stringify(state));
                turnsList.reverse().map(node => {
                 //   console.log(JSON.parse(JSON.stringify(stateCopy)), node)
                    stateCopy = turnWithMap(stateCopy, turnMaps[node.turn], node.amount);
                });
                if (JSON.stringify(stateCopy) === JSON.stringify(solvedState)) {
                    console.log("found")
                    console.log(JSON.parse(JSON.stringify(turnsList)));
                    console.log(resolvedQueue)
                    solvedStateFound = true;
                    break turnLoop;
                }
                statesQueue.push({turn: turnKey, amount: i+1, index: referenceIndex});
            }
        }
        resolvedQueue.push(statesQueue.shift())
    }
}
export {createCubeState, colorMap, turnWithMap, generateRandomState, solveState}