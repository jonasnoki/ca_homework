import {Vector3} from "three";
import {SpringParticle} from "./SpringParticle";
import {Spring} from "./Spring";

export class Rope {
    private fixed: boolean;
    private particles: SpringParticle[] = [];
    private springs: Spring[] = [];
    private fixedParticle: SpringParticle;

    constructor(lifetime: number, bouncing: number, elasticity: number, damping: number, fixed: boolean, showSpring: boolean, startPosition: Vector3, numberOfParticles = 50) {
        const mass = 1 / numberOfParticles;
        const direction = new Vector3( (Math.random() / numberOfParticles * 10) - (0.5 / numberOfParticles * 10), 0, (Math.random()  / numberOfParticles * 10) - (0.5  / numberOfParticles  * 10));
        let prev = new SpringParticle(startPosition.x, startPosition.y, startPosition.z, bouncing, lifetime, mass);
        prev.setMass(mass)
        this.fixedParticle = prev;
        this.fixed = fixed;
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
            curr.setMass(mass);
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

    setFixed(fixed: boolean): void {
        if(!fixed) this.fixedParticle.setFixed(false);
        this.fixed = fixed;
    }

    update(fixedPoint: { x: number; y: number; z: number }) {
        if(this.fixed){
            this.fixedParticle.setPosition(fixedPoint.x, fixedPoint.y, fixedPoint.z);
        }
    }
}