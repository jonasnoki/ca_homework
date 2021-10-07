import React from 'react';
import * as THREE from "three";
import {Simulation} from "./Simulation";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
// @ts-ignore
import {GUI} from "three/examples/jsm/libs/dat.gui.module";


function Scene() {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    React.useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    function init() {
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);

        camera.position.set(0, 5, 40);

        const scene = new THREE.Scene();

        const light = new THREE.AmbientLight(0x404040); // soft white light
        scene.add(light);

        const gui = new GUI();

        const simulation = new Simulation(scene, gui);

        const renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvasRef.current as HTMLCanvasElement});
        renderer.setSize(window.innerWidth, window.innerHeight);
        const controls = new OrbitControls(camera, renderer.domElement);

        controls.update();

        renderer.setAnimationLoop((time) => animation(time, camera, scene, renderer, simulation, controls));
    }

    function animation(time: number, camera: THREE.Camera, scene: THREE.Scene, renderer: THREE.WebGLRenderer, simulation: Simulation, controls: OrbitControls) {
        simulation.update(time);
        controls.update();
        renderer.render(scene, camera);

    }

    return (
        <canvas
            id="canvas"
            ref={canvasRef}
        />
    );
}

export default Scene;
