import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createCubeState, turnR, turnL, turnF, colorMap } from './cube-state';
let cubeState = createCubeState();
console.table(cubeState)

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
let cube = createCube(cubeState);
scene.add(cube);

camera.position.z = 50;
const controls = new OrbitControls(camera, renderer.domElement);
controls.update()

animate();

function animate() {
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
    positionalObject.geometry = geometry;
    for (let side = 0; side < solvedState.length; side++) {
        // Flatten the rows
        for (let cell = 0; cell < solvedState[0].flat().length; cell++) {
            const index = side * solvedState[0].flat().length + cell;
            const rowLength = solvedState[0].length;
            const row = Math.floor(cell / rowLength);
            const col = cell % rowLength;
            positionalObject.position.set(Math.random() * 50, Math.random() * 50, Math.random() * 50);
            positionalObject.rotation.x = 0;
            if (side == 1) {
                positionalObject.position.set(col,rowLength - row, 0);
                positionalObject.rotateX(0)
            } else if (side == 0) {
                // Adjust the position due to the rotation
                positionalObject.position.set(col, rowLength + stickerSize / 2, -rowLength + row + stickerSize / 2);
                console.log('rotated')
                positionalObject.rotateX(Math.PI / 2)
            }
            console.log(positionalObject.rotation.x)
            positionalObject.updateMatrix();
            cube.setMatrixAt(index, positionalObject.matrix);
            cube.setColorAt(index, new THREE.Color(colorMap[solvedState[side][row][col]]));
        }
    }
    cube.instanceColor.needsUpdate = true;
    console.log(cube)
    return cube;
}
