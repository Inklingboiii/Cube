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

function turnWithMap(state, translationMap) {
    let stateCopy = JSON.parse(JSON.stringify(state));
    console.log("statecopy")
    console.table(stateCopy)
    return state.map((side, sideIndex) => side.map((row, rowIndex) => row.map((cell, cellIndex) => {
        let newIndices = translationMap[sideIndex][rowIndex][cellIndex];
        return stateCopy[newIndices[0]][newIndices[1]][newIndices[2]]
    })));
}


export {createCubeState, colorMap, turnWithMap}