import * as THREE from 'three';
import { createCubeState, turnR, turnL, turnF } from './cube-state';
let cubeState = createCubeState();
console.table(cubeState)

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
let cube = createCube(cubeState);
scene.add(cube);

camera.position.z = 100;

function animate() {
	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );
}

animate();

function createCube(state) {
    const count = state.flat(3).length
    console.log(count)
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.InstancedMesh( geometry, material, count);
    // Used to position all instances with its .matrix
    const positionalObject = new THREE.Object3D();
    positionalObject.geometry = geometry;
    for (let index = 0; index < count; index++) {
        positionalObject.position.set(Math.random() * 50, Math.random() * 50, Math.random() * 50);
        positionalObject.updateMatrix();
        cube.setMatrixAt(index, positionalObject.matrix);
        //console.log(JSON.parse(JSON.stringify(positionalObject.matrix)))
        
    }
    return cube;
}
