import {Vector3} from "three";
import {SpringParticle} from "./SpringParticle";
import {Spring} from "./Spring";

export class Rope {
    private particles: SpringParticle[] = [];
    private springs: Spring[] = [];

    constructor(lifetime: number, bouncing: number, elasticity: number, damping: number, mass: number, fixed: boolean, showSpring: boolean, startPosition = new Vector3(0, 3, 0), numberOfParticles = 10) {
        const direction = new Vector3( Math.random() - 0.5, 0, Math.random() - 0.5);
        let prev = new SpringParticle(startPosition.x, startPosition.y, startPosition.z, bouncing, lifetime, mass);
        if(fixed){
            prev.setFixed(true);
        }
        this.particles.push(prev);
        for (let i = 1; i <= numberOfParticles; i++) {
            const pos = startPosition.clone().addScaledVector(direction, i);
            const curr = new SpringParticle(pos.x, pos.y, pos.z, bouncing, lifetime, mass);
            const spring = new Spring(prev, curr, elasticity, damping, showSpring);
            this.springs.push(spring);
            prev.addSpring(spring);
            curr.addSpring(spring);
            this.particles.push(curr);
            prev = curr;
        }
    }

    getParticles(): SpringParticle[] {
        return this.particles;
    }

    getSprings(): Spring[] {
        return this.springs;
    }

    setElasticity(e: number): void {
        this.springs.forEach(s => s.setElasticity(e))
    }

    setDamping(d: number): void {
        this.springs.forEach(s => s.setDamping(d))
    }

    setShowSpring(showSpring: boolean): void {
        this.springs.forEach(s => s.setShowSpring(showSpring))
    }
}