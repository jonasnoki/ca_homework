import {Vector3, Plane} from "three";
import {Particle} from "./Particle";

const DT = 0.01;

export class Simulation {
    public particles: Particle[] = []
    public plane: Plane;
    public collisionCount = 0;


    constructor() {
        // One particle
        const p = new Particle(0.0, 10.0, 0.0);
        this.particles.push(p);
        p.setLifetime(7.0);
        //	p.setFixed(true);
        console.log("Lifetime =" + p.getLifetime());
        p.setBouncing(1.0);
        p.addForce(new Vector3( 0, -9.8, 0));
        // One Plane
        this.plane = new Plane();
        this.plane.setFromNormalAndCoplanarPoint(new Vector3(0, 1, 0), new Vector3(0, 0, 0));

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
            if (p.collisionParticlePlane(this.plane)){
                p.correctCollisionParticlePlain(this.plane);
                console.log("rebound = " + this.collisionCount++);
            }
        })
    }
}