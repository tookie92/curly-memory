import * as THREE from 'three';
//import css
import "./style.css"
import gsap from "gsap"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {ARButton} from 'three/addons/webxr/ARButton.js';

       //Scene declared
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xbfe3dd)
      const container = document.getElementById('container');
      

      //Camera
			const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
      camera.position.set(5,2,9);
      camera.lookAt(0,2,0)
      let mixer; 
      const clock = new THREE.Clock();

      const sizes={
        width: window.innerWidth,
        height: window.innerHeight,
      }
      //light
      const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
				hemiLight.position.set( 0, 20, 0 );
				scene.add( hemiLight );

				/*const dirLight = new THREE.DirectionalLight( 0xffffff );
				dirLight.position.set( 0, 20, 10 );
				scene.add( dirLight );*/
     

      
  
			const renderer = new THREE.WebGLRenderer();
			renderer.setSize( window.innerWidth, window.innerHeight );
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.xr.enabled = true;
			container.appendChild(renderer.domElement);

      const pmremGenerator = new THREE.PMREMGenerator( renderer );
      scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.02 ).texture;



       //controls
       const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0,0.5,0);
      controls.update();
       controls.enableDamping = true;
      controls.enableZoom = false;
      controls.enablePan = false;
      


       // Add 3d objects
			const loader = new GLTFLoader();
        loader.load( 'glt/chance/poly/hand.glb', function ( gltf ) {
          const model = gltf.scene;
          model.position.set(0,-0.5,-10);
          scene.add( gltf.scene );  
  
         

          mixer = new THREE.AnimationMixer(model);
          const rotating = mixer.clipAction(gltf.animations[0]);
          rotating.play();
          rotating.loop = THREE.LoopOnce;

          const second = mixer.clipAction(gltf.animations[2]);
          second.play();
          second.loop = THREE.LoopOnce;



          mixer.addEventListener('finished', function(e){
            if(e.clipAction(gltf.animations[0])){
              rotating.reset();
              rotating.play();
            }
            else if(e.clipAction(gltf.animations[1])){
              second.reset();
              second.play();
            }
           
            
          })
        }, undefined, function ( error ) {
          console.error( error );
        } );
			
        window.onresize = function () {

          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
  
          renderer.setSize( window.innerWidth, window.innerHeight );
  
        };
        document.body.appendChild(ARButton.createButton(renderer));

        const controller = renderer.xr.getController(0);
        controller.addEventListener('select', loader);
        scene.add(controller);

			function animate() {
        controls.update();
				requestAnimationFrame( animate );
        const delta = clock.getDelta();
       mixer.update(delta);
				renderer.render( scene, camera );
			}

			animate();