import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.SphereBufferGeometry(0.1, 64, 64);

// Materials

// Mesh
// const sphere1 = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial())
// sphere1.position.x = -3
// scene.add(sphere1)

// const sphere2 = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0xff0000 }))
// sphere2.position.x = 0
// scene.add(sphere2)

// const sphere3 = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0xff0000 }))
// sphere3.position.x = 3
// scene.add(sphere3)

const count = 500
const ballsArr = new Array(count)
const ballFrequency = []

for (let i = 0; i < count; i++) {
    const mesh = new THREE.Mesh(geometry,
        new THREE.MeshNormalMaterial())

    mesh.position.x = (Math.random() - 0.5) * 10
    mesh.position.y = (Math.random() - 0.5) * 10
    mesh.position.z = (Math.random() - 0.5) * 10
    ballsArr[i] = mesh
    ballFrequency.push((Math.random() - 0.5) * 1.5)
    scene.add(mesh)

}
// console.log(ballsArr[0])

// console.log(ballsArr[0].position.x)
/**
 * RayCaster
 */
const rayCastor = new THREE.Raycaster()

/**
 * Cursor
 */
const mouse = {}
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
})

let clicked = false
window.addEventListener('click', () => { clicked = true })

// Lights

const pointLight = new THREE.PointLight(0x0000ff, 1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
scene.add(ambientLight)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () => {

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // sphere1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    // sphere2.position.y = Math.sin(elapsedTime * 0.9) * 1.5
    // sphere3.position.y = Math.sin(elapsedTime * 1.4) * 1.5
    for (let i = 0; i < count; i++) {
        ballsArr[i].position.y = Math.sin(elapsedTime * ballFrequency[i])
        // console.log(ballFrequency[i])
    }
    // console.log(ballsArr[7])

    // Cast a Ray
    rayCastor.setFromCamera(mouse, camera)
    const intersects = rayCastor.intersectObjects(ballsArr)
    // console.log(intersects)

    for (const i of ballsArr) {
        // i.material.color.set(0xffffff)
        i.material.transparent = true
        i.material.opacity = 0.6
    }

    for (const i of intersects) {
        // i.object.material.color.set(0xff0000)
        i.object.material.opacity = 1
        if (clicked === true) {
            i.object.visible = false
            clicked = false
        }
    }

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()