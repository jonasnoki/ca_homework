import {Vector3, Plane, Scene, PlaneHelper, Sphere, SphereGeometry, MeshNormalMaterial, Mesh} from "three";
import {Particle} from "./Particle";


const DT = 0.01;
const SPHERE_RADIUS = 2;
const SPHERE_POSITION = new Vector3(0,3,0);

export class Simulation {
    public particles: Particle[] = []
    public planes: Plane[] = [];
    public collisionCount = 0;
    public scene: Scene;
    private params = {spawnMethod: "explosion", arePlanesVisible: true};
    private planeHelpers: PlaneHelper[] = [];
    private sphere = new Sphere(SPHERE_POSITION, SPHERE_RADIUS);
    private sphereMesh = new Mesh(new SphereGeometry(SPHERE_RADIUS), new MeshNormalMaterial());

    constructor(scene : Scene, gui: any) {
        // One particle
        this.scene = scene
        this.sphereMesh.position.set(SPHERE_POSITION.x, SPHERE_POSITION.y,SPHERE_POSITION.z);
        this.scene.add(this.sphereMesh);
        this.createGui(gui);
        this.createPlanes();
        this.reset()

    }

    private createGui(gui: any) {
        gui.add(this.params, 'spawnMethod', ['waterfall', 'explosion', 'semi-sphere', 'fountain']).onChange( () => this.reset() );
        gui.add(this.params, 'arePlanesVisible').onChange(()=>this.togglePlaneHelperVisibility());
    }

    createPlanes(){
        const bottomPlane = new Plane(new Vector3(0, 1, 0), 0);
        const topPlane = new Plane(new Vector3(0, -1, 0), 20);
        const frontPlane = new Plane(new Vector3(0, 0, -1), 10);
        const backPlane = new Plane(new Vector3(0, 0, 1), 10);
        const rightPlane = new Plane(new Vector3(1, 0, 0), 10);
        const leftPlane = new Plane(new Vector3(-1, 0, 0), 10);
        this.planes.push(bottomPlane, topPlane, frontPlane, backPlane, rightPlane, leftPlane)

        this.planeHelpers = this.planes.map((plane )=> {
            const helper = new PlaneHelper( plane, 10, 0xffff00 );
            this.scene.add( helper );
            return helper;
        })
    }

    togglePlaneHelperVisibility(){
        this.planeHelpers.forEach(p => p.visible = !p.visible)
    }

    reset(){
        this.particles.forEach(p=> {p.delete()});
        this.particles = [];
        if(this.isMethodAtBeginning()) {
            for(let i = 0; i < 500; i++){
                this.spawnRandomParticle(this.params.spawnMethod);
            }
        }
    }

    isMethodAtBeginning(){
        return this.params.spawnMethod === "semi-sphere" ||this.params.spawnMethod === "explosion"
    }

    update(t: number){
        this.removeDeadParticles();

        if(!this.isMethodAtBeginning() && Math.floor(t) % 100 < 50){
            this.spawnRandomParticle(this.params.spawnMethod);
        }

        this.particles.forEach((p, index) => {

            const currentPosition = p.getCurrentPosition();
            // call solver types: EulerOrig, EulerSemi and Verlet(to be implemented)
            p.updateParticle(DT);
            p.logInfo();
            //Check Floor collisions
            for(const plane of this.planes){
                if (p.collisionParticlePlane(plane)){
                p.correctCollisionParticlePlain(plane);
                console.log("rebound = " + this.collisionCount++);
                }
            }
            if(p.colllisionParticleSphere(this.sphere)){
                p.correctCollisionParticleSphere(this.sphere);
            }
        })

    }
    
    private spawnRandomParticle(method : string) {
        const p = new Particle(0.0, 10.0, 0.0);
        this.particles.push(p);
        p.setLifetime(7.0);
        switch (method){
            case "waterfall":
                p.setVelocity(5 * (Math.random() - 0.5), 0, 5 * (Math.random() - 0.5));
                break;
            case "fountain":
                p.setVelocity(5 * (Math.random() - 0.5), 10, 5 * (Math.random() - 0.5));
                break;
            case "semi-sphere":
                {
                    const alpha = 360 * (Math.random() - 0.5)
                    const beta = 90 * Math.random()
                    const position = new Vector3(Math.cos(alpha)*Math.cos(beta), Math.sin(beta), Math.cos(beta) * Math.sin(alpha))
                    p.setVelocity(10 * position.x, 10 * position.y, 10 * position.z)
                }
                break;
            case "explosion":{
                const alpha = 360 * (Math.random() - 0.5)
                const beta = 180 * (Math.random() - 0.5)
                const position = new Vector3(Math.cos(alpha)*Math.cos(beta), Math.sin(beta), Math.cos(beta) * Math.sin(alpha))
                p.setVelocity(10 * position.x, 10 * position.y, 10 * position.z)
            }
            break;
            default:
                break;
        }
        p.setBouncing(0.8);
        p.addForce(new Vector3(0, -9.8, 0));
        this.scene.add(p.mesh);
    }

    removeDeadParticles() {
        for(let i = 0; i < this.particles.length;){
            if(this.particles[i].getLifetime() < 0){
                this.particles[i].delete()
                this.particles.splice(i,1);
            } else {
                i++
            }
        }
    }
}