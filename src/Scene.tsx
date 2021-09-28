import React from 'react';
import * as THREE from "three";
import {Simulation} from "./Simulation";

function Scene() {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [context, setContext] = React.useState<CanvasRenderingContext2D | null>(null);

    React.useEffect(() => {
        init();
    }, [context]);


    function init() {
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);

        camera.position.set(0, 5, 40);

        const scene = new THREE.Scene();

        const light = new THREE.AmbientLight(0x404040); // soft white light
        scene.add(light);

        const simulation = new Simulation();

        simulation.particles.forEach(particle => scene.add(particle.mesh))

        const renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvasRef.current as HTMLCanvasElement});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setAnimationLoop((time) => animation(time, camera, scene, renderer, simulation));
    }

    function animation(time: number, camera: THREE.Camera, scene: THREE.Scene, renderer: THREE.WebGLRenderer, simulation: Simulation) {
        simulation.update(time);
        renderer.render(scene, camera);

    }

    return (
        <canvas
            id="canvas"
            ref={canvasRef}
        ></canvas>
    );
}

export default Scene;
