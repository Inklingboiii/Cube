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
        if (sideIndex === 4 || sideIndex === 5) return side
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
        if (sideIndex === 5) return side
        return side.map((row, rowIndex) => {
            // Modulus operator so it wraps around
            //if (sideIndex === 3) row[0] = stateCopy[0][rowIndex][0];
            if (sideIndex === 0) row[0] = state[3][rowIndex][0]
            else row[0] = stateCopy[sideIndex - 1][rowIndex][0];
            return row;
        })
    });
}

function turnF(state) {
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

export {createCubeState, turnR, turnL, turnF, colorMap}