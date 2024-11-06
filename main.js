import './style.css'
import 'lenis/dist/lenis.css'
import Lenis from 'lenis'
import * as THREE from 'three';
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import gsap from 'gsap';


// Initialize Lenis
const lenis = new Lenis();

// Listen for the scroll event and log the event data
lenis.on('scroll', (e) => {
//   console.log(e);
});

// Use requestAnimationFrame to continuously update the scroll
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);



const scene = new THREE.Scene();
const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas, alpha: true });

// Set renderer size and pixel ratio
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const rayCaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()



// Calculate fov so that 1 unit equals 1 pixel at camera's z distance
function calculateFOV() {
  // Camera distance from the plane
  const distance = 5;

  // Set camera's aspect ratio and fov
  const vFov = 2 * Math.atan(window.innerHeight / (2 * distance)) * (180 / Math.PI);
  return vFov;
}

// Set up the camera with calculated FOV
const camera = new THREE.PerspectiveCamera(calculateFOV(), window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Basic plane example

const images = document.querySelectorAll('img')
const planes = []
images.forEach(images=>{
    const imgBounds = images.getBoundingClientRect()
    const texture = new THREE.TextureLoader().load(images.src)
    texture.colorSpace = THREE.SRGBColorSpace
    const geometry = new THREE.PlaneGeometry(imgBounds.width, imgBounds.height);
    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            uTexture: new THREE.Uniform(texture),
            uMouse: new THREE.Uniform(new THREE.Vector2(0.5, 0.5)),
            uHover: new THREE.Uniform(0),
            uIntensity: new THREE.Uniform(1.5)
        }
    })
    const plane = new THREE.Mesh(geometry, material)
    plane.position.x = imgBounds.left - window.innerWidth / 2 + imgBounds.width / 2;
    plane.position.y = - imgBounds.top + window.innerHeight / 2 - imgBounds.height / 2;
    planes.push(plane)
    scene.add(plane)
})

function updatePlanesPosition (){
    planes.forEach((plane, index)=>{
        const image = images[index]
        const imgBounds = image.getBoundingClientRect()
        plane.position.x = imgBounds.left - window.innerWidth / 2 + imgBounds.width / 2;
        plane.position.y = - imgBounds.top + window.innerHeight / 2 - imgBounds.height / 2;
    })

}

lenis.on('scroll', updatePlanesPosition)

function mouseEffect(){
    window.addEventListener('mousemove', (event) => {
        // Normalize mouse position to -1 to 1 for both axes
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    
        // Update raycaster based on mouse position
        rayCaster.setFromCamera(mouse, camera);
    
        // Find the intersection between the ray and the planes
        const intersects = rayCaster.intersectObjects(planes);

        planes.forEach(plane=>{
            plane.material.uniforms.uHover.value = 0
        })
    
        if (intersects.length > 0) {
            const intersectedPlane = intersects[0];
            const uv = intersectedPlane.uv; // This gives the texture coordinates of the intersection

            
    
            // Pass the correct UV coordinates to the shader
            intersectedPlane.object.material.uniforms.uMouse.value.set(uv.x, uv.y);

            gsap.to(intersectedPlane.object.material.uniforms.uMouse.value, {
                x: uv.x,
                y: uv.y,
                duration: .4,
                ease: 'power4.inOut'
            })

            intersectedPlane.object.material.uniforms.uHover.value = 1
        }
      
    });
}

mouseEffect()

// Handle window resize
window.addEventListener('resize', () => {
    // Update camera aspect and fov
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.fov = calculateFOV();
    camera.updateProjectionMatrix();
    
    // Update renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    updatePlanesPosition()
  });

function animate() {
    requestAnimationFrame(animate);
    updatePlanesPosition()
    mouseEffect()
    renderer.render(scene, camera);
  }

  animate();
  










