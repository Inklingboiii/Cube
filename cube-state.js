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
    for (let i = 0; i < 3; i++) {
        let turnKey = possibleTurns[Math.floor(possibleTurns.length * Math.random())];
        let amount = Math.floor(Math.random() * 3) + 1;
        state = turnWithMap(state, turnMaps[turnKey], amount)
        turnsList.push(`${turnKey}${amount === 3 ? '\'' : amount === 2 ? '2' : ''}`);
    }
    console.log(turnsList.join(" "))
    return state;
}

function generateSolutionToState(state) {
    let solvedState = createCubeState();
    let statesQueue = [];
    let statesQueueBackwards = []
    let resolvedQueue = [];
    let resolvedQueueBackwards = [];
    resolvedQueue.push({turn: null,amount: 0, index: -1});
    resolvedQueueBackwards.push({turn: null,amount: 0, index: -1});
    let solvedStateFound = false;
    let solution = [];

    for (const turnKey in turnMaps) {
        for (let i = 0; i < 3; i++) {
            statesQueue.push({turn: turnKey, amount: i+1, index: 0});
            statesQueueBackwards.push({turn: turnKey, amount: i+1, index: 0});
        }
    }
    for (let i = 0; i < 10000; i++) {
        if(solvedStateFound) break;
        const referenceIndex = resolvedQueue.length;
        turnLoop:
        for (const turnKey in turnMaps) {
            if(statesQueue[0].turn === turnKey) continue;
            for (let i = 0; i < 3; i++) {
                let {stateCopy, turnsList} = convertNodeToState(statesQueue[0], JSON.parse(JSON.stringify(state)), resolvedQueue);
                if (JSON.stringify(stateCopy) === JSON.stringify(solvedState)) {
                    console.log("found regular")
                    solution = turnsList;
                    solvedStateFound = true;
                    break turnLoop;
                }
                resolvedQueueBackwards.map((backwardsNode, index) => {
                    if (index === 0 || solvedStateFound) return;
                    let {stateCopy: backwardsCopy, turnsList: turnsListBackwards} = convertNodeToState(backwardsNode, solvedState, resolvedQueueBackwards)
                    if(JSON.stringify(stateCopy) === JSON.stringify(backwardsCopy)) {
                        let finalPath = [...turnsList, ...turnsListBackwards.map((turn) => ({turn: turn.turn, amount: turn.amount === 2 ? 2 : (turn.amount + 2) % 4}))];
                        console.log(turnsList, turnsListBackwards)
                        solution = finalPath;
                        solvedStateFound = true;
                    }
                })
                statesQueue.push({turn: turnKey, amount: i+1, index: referenceIndex});
            }
        }
        turnLoopBackwards:
        for (const turnKey in turnMaps) {
            if(statesQueueBackwards[0].turn === turnKey) continue;
            for (let i = 0; i < 3; i++) {
                let {stateCopy, turnsList} = convertNodeToState(statesQueueBackwards[0], solvedState, resolvedQueueBackwards);
                if (JSON.stringify(stateCopy) === JSON.stringify(state)) {
                    console.log("found reversed")
                    solution = turnsList;
                    solvedStateFound = true;
                    break turnLoopBackwards;
                }
                statesQueueBackwards.push({turn: turnKey, amount: i+1, index: referenceIndex});
            }
        }
        resolvedQueue.push(statesQueue.shift());
        resolvedQueueBackwards.push(statesQueueBackwards.shift());
    }
    return solution;
}

function solveState(state, colorCube) {
    generateSolutionToState(state).map(turn => {
        turnWithMap(state, turnMaps[turn.turn], turn.amount);
        colorCube(state)
    })
}

function convertNodeToState(node, stateCopy, queue) {
    let turnsList = []
    // Check if position is already om solved state before adding turns
    while(true) {
        turnsList.push(node);
        node = queue[node.index];
        if(node.index < 0) break;
    }
    turnsList.reverse().map(node => stateCopy = turnWithMap(stateCopy, turnMaps[node.turn], node.amount));
    return {stateCopy, turnsList}
}
export {createCubeState, colorMap, turnWithMap, generateRandomState, generateSolutionToState, solveState}