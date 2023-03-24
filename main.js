import * as THREE from 'three';
//import css
import "./style.css"
import gsap from "gsap"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


      const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 10000 );
      //light
      const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 2 );
       scene.add( light );

      

			const renderer = new THREE.WebGLRenderer();
			renderer.setSize( window.innerWidth, window.innerHeight );
			document.body.appendChild( renderer.domElement );


       //controls
       const controls = new OrbitControls(camera, renderer.domElement);
       camera.position.set(0,20,100);
       controls.enableDamping = false;
       controls.enableZoom = false;
       controls.update();


       // Add 3d objects
			const loader = new GLTFLoader();

        loader.load( 'glt/chance/poly/iso.glb', function ( gltf ) {
         
          controls.update();
         
          scene.add( gltf.scene );  


        }, undefined, function ( error ) {

          console.error( error );

        } );

			camera.position.z = 5;

			function animate() {
				requestAnimationFrame( animate );
				renderer.render( scene, camera );
			}

			animate();