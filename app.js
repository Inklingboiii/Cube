import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createCubeState, turnR, turnL, turnF, colorMap } from './cube-state';
let cubeState = createCubeState();
cubeState = turnF(cubeState);
cubeState = turnL(cubeState);
console.table(cubeState)

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
let cube = createCube(cubeState);
scene.add(cube);

camera.position.z = 10;
camera.position.y = 3;
const controls = new OrbitControls(camera, renderer.domElement);
controls.update()

animate();

function animate() {
    //recolorCube(cubeState)
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

function createCube(solvedState) {
    const stickerSize = 1;
    let flattenedState = solvedState.flat(3);
    const count = flattenedState.length
    const geometry = new THREE.PlaneGeometry(stickerSize, stickerSize, stickerSize);
    const material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
    const cube = new THREE.InstancedMesh( geometry, material, count);
    // Used to position all instances with its .matrix
    const positionalObject = new THREE.Object3D();
    for (let side = 0; side < solvedState.length; side++) {
        // Flatten the rows
        for (let cell = 0; cell < solvedState[0].flat().length; cell++) {
            const index = side * solvedState[0].flat().length + cell;
            const rowLength = solvedState[0].length;
            const row = Math.floor(cell / rowLength);
            const col = cell % rowLength;
            positionalObject.rotation.x = 0;
            positionalObject.rotation.y = 0;
            if (side === 0) {
                // Adjust the position due to the rotation
                positionalObject.position.set(col, rowLength + stickerSize / 2, -rowLength + row + stickerSize / 2);
                positionalObject.rotateX(Math.PI / 2)
            } else if (side === 1) {
                positionalObject.position.set(col,rowLength - row, 0);
                positionalObject.rotateX(0)
            } else if(side === 2) {
                positionalObject.position.set(col, 0 + stickerSize / 2, -rowLength + row + stickerSize / 2);
                positionalObject.rotateX(Math.PI / 2)
            }
            else if (side === 3) {
                positionalObject.position.set(col,rowLength - row, -rowLength);
                positionalObject.rotateX(0)
            }
            else if (side === 4) {
                positionalObject.position.set(rowLength - stickerSize / 2, rowLength - row, -col - stickerSize / 2);
                positionalObject.rotateY(Math.PI / 2)
            }
            else if (side === 5) {
                positionalObject.position.set(-stickerSize / 2, rowLength - row, col - rowLength + stickerSize / 2);
                positionalObject.rotateY(Math.PI / 2)
            }
            positionalObject.updateMatrix();
            cube.setMatrixAt(index, positionalObject.matrix);
            cube.setColorAt(index, new THREE.Color(colorMap[solvedState[side][row][col]]));
            const edges = new THREE.EdgesGeometry( geometry ); 
            const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0x000, linewidth: 5 } )); 
            line.applyMatrix4(positionalObject.matrix)
            cube.add( line );
        }
    }
    cube.instanceColor.needsUpdate = true;
    cube.rotation.x = 0.5
    cube.rotation.y = -0.5;
    return cube;
}

function recolorCube(state) {
    let flattenedState = state.flat(3);
    flattenedState.forEach((cell, index) => cube.setColorAt(index, new THREE.Color(colorMap[cell])));
}
