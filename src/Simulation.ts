import {Vector3, Plane} from "three";
import {Particle} from "./Particle";

const DT = 0.01;

export class Simulation {
    public particles: Particle[] = []
    public planes: Plane[] = [];
    public collisionCount = 0;


    constructor() {
        // One particle
        const p = new Particle(0.0, 10.0, 0.0);
        this.particles.push(p);
        p.setLifetime(7.0);
        p.setVelocity(0,-5,0)
        //	p.setFixed(true);
        console.log("Lifetime =" + p.getLifetime());
        p.setBouncing(1.0);
        //p.addForce(new Vector3( 0, -9.8, 0));
        // One Plane
        const bottomPlane = new Plane();
        bottomPlane.setFromNormalAndCoplanarPoint(new Vector3(0, 1, 0), new Vector3(0, 0, 0));
        const topPlane = new Plane()
        topPlane.setFromNormalAndCoplanarPoint(new Vector3(0, -1, 0), new Vector3(0, 20, 0))
        const frontPlane = new Plane()
        frontPlane.setFromNormalAndCoplanarPoint(new Vector3(0, 0, -1), new Vector3(0, 0, 10))
        const backPlane = new Plane()
        backPlane.setFromNormalAndCoplanarPoint(new Vector3(0, 0, 1), new Vector3(0, 0, -10))
        const rightPlane = new Plane()
        rightPlane.setFromNormalAndCoplanarPoint(new Vector3(1, 0, 0), new Vector3(-10, 0, 0))
        const leftPlane = new Plane()
        leftPlane.setFromNormalAndCoplanarPoint(new Vector3(-1, 0, 0), new Vector3(10, 0, 0))

        this.planes.push(bottomPlane, topPlane, frontPlane, backPlane, rightPlane, leftPlane)

        p.logInfo()
    }

    update(t: number){
        console.log(t)
        this.particles.forEach(p => {
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
            
        })
    }
}