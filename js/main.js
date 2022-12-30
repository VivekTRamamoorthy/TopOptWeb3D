import * as THREE from './three.module.js';
        
import { OrbitControls } from './OrbitControls.js';

// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // background color

// Camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
if(window.innerWidth <600){
    camera.position.set(30,30,30)
}else{
    camera.position.set(15,15,15)
}

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// controls

let controls = new OrbitControls( camera, renderer.domElement );
// controls.listenToKeyEvents( window ); 
controls.enableDamping = true; 
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 1;
controls.maxDistance = 500;
controls.maxPolarAngle = Math.PI / 2;

// Axes
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

// Light
const light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set( 0, 5, 5 ); //default; light from top
light.castShadow = true; // default false
scene.add( light );
// Light
const ambientLight = new THREE.AmbientLight( 0xffffff, .7 );
scene.add( ambientLight );


let blocks = [];
let materials = [];


    // constants
let blockWidth = 1;
let platformHeight = 2*nely;
let blockSpacing = 2;
let platformWidth = blockWidth+2*blockSpacing;
let noOfBlocks = 5;
let platformLength = blockWidth*noOfBlocks+blockSpacing*(noOfBlocks+1)

// Base platform
const geometry = new THREE.BoxGeometry(platformWidth,platformHeight,platformLength);
const materialGrass = new THREE.MeshPhongMaterial( { color: 0x71797E } );
const platform = new THREE.Mesh( geometry, materialGrass );
scene.add( platform );
platform.position.x = -nelx/2;
platform.position.y = nely/4;
platform.position.z = 0;


// creating blocks
let blockSize = 1;

const geometryVoxel = new THREE.BoxGeometry(blockSize,blockSize,blockSize);
for (let i = 0; i < nelx; i++) {
    blocks[i]=[];
    materials[i]=[];
    for (let j = 0; j < nely; j++) {
        blocks[i][j]=[];
        materials[i][j]=[];
        for (let k = 0; k < nelz; k++) {
            const materialijk = new THREE.MeshPhongMaterial( { color: 0x71797E, transparent: true } );
            const blockijk = new THREE.Mesh( geometryVoxel, materialijk );
            blocks[i][j][k] = blockijk;
            materials[i][j][k] = materialijk;
            scene.add( blockijk );
            blockijk.position.x = i*blockSize + blockSize/2 - nelx/2;
            blockijk.position.y = j*blockSize + blockSize/2 ;
            blockijk.position.z = k*blockSize + blockSize/2;
        
        }
    }
}






renderer.render( scene, camera ); // t
const animate = function (timems) {
    requestAnimationFrame( animate );
    let timeS =timems/1000;
    let itr =  Math.round(timeS*5);

    // Update
    controls.update();
    if(resultLoaded && itr <MatFileContents.res.loop.length){

        let res = MatFileContents.res;
        let nelx = res.nelx[0];
        let nely = res.nely[0];
        let nelz = res.nelz[0];
        let x = res.loop[itr].x;
        document.getElementById('topright').innerText = "Iteration:"+itr
        for (let i = 0; i < nelx; i++) {
            for (let j = 0; j < nely; j++) {
                for (let k = 0; k < nelz; k++) {
                    const blockijk = blocks[i][j][k];
                    let ii = nely-j-1; // to flip y and x and to invert y
                    let jj = (i-3*k+nelx)%nelx; // to fix loading bug
                    let colorCode = 1-x[ii][jj][k];
                    if(colorCode <0.5){
                        colorCode =0;
                    }
                    // if(colorCode >0.8){
                    //     colorCode =1;
                    // }
                    blockijk.material.opacity = parseFloat((1-colorCode).toPrecision(2));
                    blockijk.material.color.b = colorCode;
                    blockijk.material.color.g = colorCode;
                    blockijk.material.color.r = colorCode;


                }
            }
        }

    }

    // Render
    renderer.render( scene, camera ); 
};

animate();


window.addEventListener('onresize',onWindowResize,false)

function onWindowResize(){
    camera.aspect =  window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}