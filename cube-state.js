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
function turnR(state) {
    let stateCopy = JSON.parse(JSON.stringify(state))
    return state.map((side, sideIndex) => {
        // exclude left and right sides that dont get changed
        if (sideIndex === 5) return side
        if(sideIndex === 4) return side[0].map((val, index) => side.map(row => row[index]).reverse())
        return side.map((row, rowIndex) => {
            // Modulus operator so it wraps around
            if (sideIndex === 3) row[2] = stateCopy[0][rowIndex][2];
            else row[2] = stateCopy[(sideIndex + 1) % state.length][rowIndex][2];
            return row;
        })
    });
}

function turnL(state) {
    let stateCopy = JSON.parse(JSON.stringify(state))
    return state.map((side, sideIndex) => {
        // exclude left and right sides that dont get changed
        if (sideIndex === 4) return side
        // https://stackoverflow.com/questions/15170942/how-to-rotate-a-matrix-in-an-array-in-javascript
        if(sideIndex === 5) return side[0].map((val, index) => side.map(row => row[index]).reverse())
        return side.map((row, rowIndex) => {
            if (sideIndex === 0) row[0] = state[3][rowIndex][0]
            else row[0] = stateCopy[sideIndex - 1][rowIndex][0];
            return row;
        })
    });
}

/*function turnF(state) {
    let stateCopy = JSON.parse(JSON.stringify(state))
    return state.map((side, sideIndex) => {
        // exclude left and right sides that dont get changed
        if (sideIndex === 1 || sideIndex === 3) return side
        return side.map((row, rowIndex) => {
            if(sideIndex === 0) {
                if (rowIndex === 2) {
                    row = row.map((cell, cellIndex) => stateCopy[5][cellIndex][2]);
                }
            }
            if(sideIndex === 2) {
                if (rowIndex === 2) {
                    row = row.map((cell, cellIndex) => stateCopy[4][cellIndex][0]);
                }
            }
            if(sideIndex === 4) {
                row[0] = stateCopy[0][2][rowIndex]
            }
            if(sideIndex === 5) {
                row[2] = stateCopy[2][0][rowIndex]
            }
            
            return row;
        })
    });
}
*/
/*function turnF(state) {
    let rotatedState = [state[0], state[5], state[2], state[4], state[1], state[3]];
    rotatedState = turnMap(rotatedState);
    rotatedState = [rotatedState[0], rotatedState[4], rotatedState[2], rotatedState[5], rotatedState[3], rotatedState[1]]
    rotatedState[0] = rotatedState[0][0].map((val, index) => rotatedState[0].map(row => row[index]).reverse())
    rotatedState[2] = rotatedState[2][0].map((val, index) => rotatedState[2].map(row => row[row.length-1-index]));
    return rotatedState
}*/
function turnF(state) {
    let translationMap = [
        [
            [[0, 0, 0], [0, 0, 1], [0, 0, 2]],
            [[0, 1, 0], [0, 1, 1], [0, 1, 2]],
            [[5, 2, 2], [5, 1, 2], [5, 0, 2]],
        ],
        [
            [[1, 2, 0], [1, 1, 0], [1, 0, 0]],
            [[1, 2, 1], [1, 1, 1], [1, 0, 1]],
            [[1, 2, 2], [1, 1, 2], [1, 0, 2]],
        ],
        [
            [[4, 2, 0], [4, 1, 0], [4, 0, 0]],
            [[2, 1, 0], [2, 1, 1], [2, 1, 2]],
            [[2, 2, 0], [2, 2, 1], [2, 2, 2]],
        ],
        [
            [[3, 0, 0], [3, 0, 1], [3, 0, 2]],
            [[3, 1, 0], [3, 1, 1], [3, 1, 2]],
            [[3, 2, 0], [3, 2, 1], [3, 2, 2]],
        ],
        [
            [[0, 2, 0], [4, 0, 1], [4, 0, 2]],
            [[0, 2, 1], [4, 1, 1], [4, 1, 2]],
            [[0, 2, 2], [4, 2, 1], [4, 2, 2]],
        ],
        [
            [[5, 0, 0], [5, 0, 1], [2, 0, 0]],
            [[5, 1, 0], [5, 1, 1], [2, 0, 1]],
            [[5, 2, 0], [5, 2, 1], [2, 0, 2]],
        ],
    ];
    let stateCopy = JSON.parse(JSON.stringify(state));
    console.log("statecopy")
    console.table(stateCopy)
    return state.map((side, sideIndex) => side.map((row, rowIndex) => row.map((cell, cellIndex) => {
        let newIndices = translationMap[sideIndex][rowIndex][cellIndex];
        return stateCopy[newIndices[0]][newIndices[1]][newIndices[2]]
    })));
}

function turnMap(state) {
    let translationMap = [
        [
            [[0, 0, 0], [0, 0, 1], [1, 0, 2]],
            [[0, 1, 0], [0, 1, 1], [1, 1, 2]],
            [[0, 2, 0], [0, 2, 1], [1, 2, 2]],
        ],
        [
            [[1, 0, 0], [1, 0, 1], [2, 0, 2]],
            [[1, 1, 0], [1, 1, 1], [2, 1, 2]],
            [[1, 2, 0], [1, 2, 1], [2, 2, 2]],
        ],
        [
            [[2, 0, 0], [2, 0, 1], [3, 2, 0]],
            [[2, 1, 0], [2, 1, 1], [3, 1, 0]],
            [[2, 2, 0], [2, 2, 1], [3, 0, 0]],
        ],
        [
            [[0, 2, 2], [3, 0, 1], [3, 0, 2]],
            [[0, 1, 2], [3, 1, 1], [3, 1, 2]],
            [[0, 0, 2], [3, 2, 1], [3, 2, 2]],
        ],
        [
            [[4, 2, 0], [4, 1, 0], [4, 0, 0]],
            [[4, 2, 1], [4, 1, 1], [4, 0, 1]],
            [[4, 2, 2], [4, 1, 2], [4, 0, 2]],
        ],
        [
            [[5, 0, 0], [5, 0, 1], [5, 0, 2]],
            [[5, 1, 0], [5, 1, 1], [5, 1, 2]],
            [[5, 2, 0], [5, 2, 1], [5, 2, 2]],
        ],
    ];
    let stateCopy = JSON.parse(JSON.stringify(state));
    console.log("statecopy")
    console.table(stateCopy)
    return state.map((side, sideIndex) => side.map((row, rowIndex) => row.map((cell, cellIndex) => {
        let newIndices = translationMap[sideIndex][rowIndex][cellIndex];
        return stateCopy[newIndices[0]][newIndices[1]][newIndices[2]]
    })));
}


export {createCubeState, turnR, turnL, turnF, colorMap, turnMap}