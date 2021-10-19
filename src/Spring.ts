import {Vector3} from "three";
import {SpringParticle} from "./SpringParticle";

export class Spring {
    private particleA: SpringParticle;
    private particleB: SpringParticle;
    private elasticity: number;
    private damping: number;
    private restingDist: number;

    constructor(particleA: SpringParticle, particleB: SpringParticle, elasticity= 1, damping = 0.4) {
        this.particleA = particleA;
        this.particleB = particleB;
        this.elasticity = elasticity;
        this.damping = damping;
        this.restingDist = this.particleA.getCurrentPosition().clone().sub(this.particleA.getCurrentPosition()).length()
    }

    calcForce(particle: SpringParticle): Vector3 {
        const ab = this.particleB.getCurrentPosition().clone().sub(this.particleA.getCurrentPosition());
        const velocityDifference: Vector3 = this.particleB.getVelocity().clone().sub(this.particleA.getVelocity());
        // this.elasticity * (ab.length() - this.restingDist) + this.damping * velocityDifference
        const force = new Vector3();
        return particle === this.particleA ? force : force.negate();
    }
}