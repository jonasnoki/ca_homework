import {
    Vector3,
    Plane,
    Scene,
    PlaneHelper,
    Sphere,
    SphereGeometry,
    Mesh,
    MeshPhongMaterial
} from "three";
import {Particle} from "./Particle";


const DT = 0.01;
const SPHERE_RADIUS = 3;
const PARTICLE_RADIUS = 0.3;
const SPHERE_POSITION = new Vector3(0, -5, 0);

export class Simulation {
    private params = {
        removeAllParticles: () => {
            this.removeAllParticles()
        },
        spawnMethod: "explosion",
        arePlanesVisible: true,
        solverMethod: "euler-semi",
        bouncing: 1,
        lifetime: 7,
        gravity: {
            x: 0,
            y: -9.81,
            z: 0,
        }
    };

    public particles: Particle[] = []
    public planes: Plane[] = [];
    public collisionCount = 0;
    public scene: Scene;

    private planeHelpers: PlaneHelper[] = [];
    private sphere = new Sphere(SPHERE_POSITION, SPHERE_RADIUS);
    private sphereMesh = new Mesh(new SphereGeometry(SPHERE_RADIUS - PARTICLE_RADIUS), new MeshPhongMaterial());

    constructor(scene: Scene, gui: any) {
        // One particle
        this.scene = scene
        this.sphereMesh.material.color.setHSL(.96, 1, .5)
        this.sphereMesh.position.set(SPHERE_POSITION.x, SPHERE_POSITION.y, SPHERE_POSITION.z);
        this.scene.add(this.sphereMesh);
        this.createGui(gui);
        this.createPlanes();
        this.spawnParticles()

    }

    private createGui(gui: any) {
        gui.add(this.params, 'removeAllParticles').name('Remove Particles');
        gui.add(this.params, 'spawnMethod', ['waterfall', 'explosion', 'semi-sphere', 'fountain'])
            .onChange(() => this.spawnParticles())
            .name('Spawn Method');
        gui.add(this.params, 'solverMethod', ['euler-semi', 'euler-orig', 'verlet']).name('Solver Method');
        gui.add(this.params, 'bouncing', 0, 1)
            .name('Bouncing')
            .onChange((b: number) => this.particles.forEach(p => p.setBouncing(b)));
        gui.add(this.params, 'lifetime', 0, 100)
            .name('Lifetime')
            .onChange((b: number) => this.particles.forEach(p => p.setLifetime(b)));
        gui.add(this.params, 'arePlanesVisible')
            .name('Show Planes')
            .onChange(() => this.togglePlaneHelperVisibility());
        const gravityFolder: any = gui.addFolder('Gravity');
        gravityFolder.add(this.params.gravity, 'x', -20, 20)
            .onChange(() => this.applyGravityToAllParticles());
        gravityFolder.add(this.params.gravity, 'y', -20, 20)
            .onChange(() => this.applyGravityToAllParticles());
        gravityFolder.add(this.params.gravity, 'z', -20, 20)
            .onChange(() => this.applyGravityToAllParticles());
    }

    createPlanes() {
        const bottomPlane = new Plane(new Vector3(0, 1, 0), 10);
        const topPlane = new Plane(new Vector3(0, -1, 0), 10);
        const frontPlane = new Plane(new Vector3(0, 0, -1), 10);
        const backPlane = new Plane(new Vector3(0, 0, 1), 10);
        const rightPlane = new Plane(new Vector3(1, 0, 0), 10);
        const leftPlane = new Plane(new Vector3(-1, 0, 0), 10);
        this.planes.push(bottomPlane, topPlane, frontPlane, backPlane, rightPlane, leftPlane)

        this.planeHelpers = this.planes.map((plane) => {
            const visualizedPlane = plane.clone();
            visualizedPlane.translate(visualizedPlane.normal.clone().normalize().multiplyScalar(- Particle.radius))
            const helper = new PlaneHelper(visualizedPlane, 20 + (2*Particle.radius), 0xffff00);
            this.scene.add(helper);
            return helper;
        })
    }

    togglePlaneHelperVisibility() {
        this.planeHelpers.forEach(p => p.visible = !p.visible)
    }

    applyGravityToAllParticles() {
        this.particles.forEach(p =>
            p.setForce(this.params.gravity.x, this.params.gravity.y, this.params.gravity.z)
        )
    }

    spawnParticles() {
        if (this.isMethodAtBeginning()) {
            for (let i = 0; i < 500; i++) {
                this.spawnRandomParticle(this.params.spawnMethod);
            }
        }
    }

    removeAllParticles() {
        this.particles.forEach(p => {
            p.delete()
        });
        this.particles = [];
    }

    isMethodAtBeginning() {
        return this.params.spawnMethod === "semi-sphere" || this.params.spawnMethod === "explosion"
    }

    update(t: number) {
        this.removeDeadParticles();

        if (!this.isMethodAtBeginning() && Math.floor(t) % 100 < 50) {
            this.spawnRandomParticle(this.params.spawnMethod);
        }

        this.particles.forEach(p => {

            // call solver types: EulerOrig, EulerSemi and Verlet(to be implemented)
            p.updateParticle(DT, this.params.solverMethod);
            // p.logInfo();
            //Check Floor collisions
            for (const plane of this.planes) {
                if (p.collisionParticlePlane(plane)) {
                    p.correctCollisionParticlePlain(plane);
                }
            }
            if (p.colllisionParticleSphere(this.sphere)) {
                p.correctCollisionParticleSphere(this.sphere);
            }
        })

    }

    private spawnRandomParticle(method: string) {
        const p = new Particle(0.0, 0.0, 0.0, this.params.bouncing, this.params.lifetime);
        this.particles.push(p);
        switch (method) {
            case "waterfall":
                p.setVelocity(5 * (Math.random() - 0.5), 0, 5 * (Math.random() - 0.5));
                break;
            case "fountain":
                p.setVelocity(5 * (Math.random() - 0.5), 10, 5 * (Math.random() - 0.5));
                break;
            case "semi-sphere": {
                const position = this.getRandomSpherePosition(true);
                p.setVelocity(10 * position.x, 10 * position.y, 10 * position.z)
            }
                break;
            case "explosion": {
                const position = this.getRandomSpherePosition();
                p.setVelocity(10 * position.x, 10 * position.y, 10 * position.z)
            }
                break;
            default:
                break;
        }
        p.setForce(this.params.gravity.x, this.params.gravity.y, this.params.gravity.z);
        this.scene.add(p.getMesh());
    }

    private degsToRads(deg: number) {
        return (deg * Math.PI) / 180.0
    };

    private getRandomSpherePosition(isSemiSphere = false) {
        const alpha = this.degsToRads(360) * (Math.random() - 0.5)
        const beta = this.degsToRads(isSemiSphere ? 90 : 180) * (Math.random() - (isSemiSphere ? 0 : 0.5))
        return new Vector3(Math.cos(alpha) * Math.cos(beta), Math.sin(beta), Math.cos(beta) * Math.sin(alpha))
    }

    removeDeadParticles() {
        for (let i = 0; i < this.particles.length;) {
            if (this.particles[i].getLifetime() < 0) {
                this.particles[i].delete()
                this.particles.splice(i, 1);
            } else {
                i++
            }
        }
    }
}