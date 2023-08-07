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
    return state.map((side, sideIndex) => {
        // exclude left and right sides that dont get changed
        if (sideIndex === 4 || 5) return side
        return side.map((row, rowIndex) => {
            // Modulus operator so it wraps around
            row[2] = state[(sideIndex + 1) % state.length][rowIndex][2];
            return row;
        })
    });
}

function turnL(state) {
    return state.map((side, sideIndex) => {
        // exclude left and right sides that dont get changed
        if (sideIndex === 4 || sideIndex == 5) return side
        return side.map((row, rowIndex) => {
            // add before using modules so its positive
            row[0] = state[(sideIndex - 1 + state.length) % state.length][rowIndex][0];
            return row;
        })
    });
}

function turnF(state) {
    let map = [5, 1, 4, 3, 0, 2]
    return state.map((side, sideIndex) => {
        if (sideIndex === 0) return [side[0], side[1], side[2].map((cell, index) => state[map[sideIndex]][index])];
        if (sideIndex === 2) return [side[0].map((cell, index) => state[map[sideIndex]][index]), side[1], side[2]];
        return side.map((row, rowIndex) => {
            row[2] = state[map[sideIndex]][rowIndex][2];
            return row;
        })
    });
}

export {createCubeState, turnR, turnL, turnF, colorMap}