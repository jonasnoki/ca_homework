import {Vector3} from "three";
import {SpringParticle} from "./SpringParticle";
import {Spring} from "./Spring";

export class Rope {
    private particles: SpringParticle[] = [];

    constructor(lifetime: number, bouncing: number,fixedPosition = new Vector3(1,1,1), direction = new Vector3(0.2,0,0), numberOfParticles = 20) {
        let prev = new SpringParticle(fixedPosition.x, fixedPosition.y, fixedPosition.z, bouncing, lifetime);
        this.particles.push(prev);
        for(let i = 1; i <= numberOfParticles; i++){
            const pos = fixedPosition.clone().addScaledVector(direction, i);
            const curr = new SpringParticle(pos.x, pos.y, pos.z, bouncing, lifetime);
            if(i !== numberOfParticles - 1){
                const spring = new Spring(prev, curr);
                prev.addSpring(spring);
                curr.addSpring(spring);
            }
            this.particles.push(curr);
            prev = curr;
        }
    }

    getParticles(): SpringParticle[] {
        return this.particles
    }
}