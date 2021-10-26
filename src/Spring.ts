import {
    BufferGeometry,
    Line,
    LineBasicMaterial,
    Material,
    Vector3
} from "three";
import {SpringParticle} from "./SpringParticle";


export class Spring {
    private particleA: SpringParticle;
    private particleB: SpringParticle;
    private elasticity: number;
    private damping: number;
    private restingDist: number;
    private mesh: Line;
    private showSpring: boolean;

    private geometry = new BufferGeometry();
    private static material = new LineBasicMaterial({
        color: 0xfaf0be
    });

    constructor(particleA: SpringParticle, particleB: SpringParticle, elasticity: number, damping: number, showSpring: boolean) {
        this.particleA = particleA;
        this.particleB = particleB;
        this.elasticity = elasticity;
        this.damping = damping;
        this.showSpring = showSpring;
        this.restingDist = this.particleA.getCurrentPosition().clone().sub(this.particleB.getCurrentPosition()).length()
        this.mesh = new Line( this.geometry, Spring.material );
    }

    public setElasticity(e: number){
        this.elasticity = e;
    }

    public setDamping(d: number){
        this.damping = d;
    }

    public setShowSpring(s: boolean){
        this.particleA.getMesh().visible = !s
        this.particleB.getMesh().visible = !s
        this.showSpring = s;
        this.mesh.visible = s;
    }

    public calcForce(particle: SpringParticle): Vector3 {
        const pA =  this.particleA.getCurrentPosition().clone();
        const pB = this.particleB.getCurrentPosition().clone();

        if(this.showSpring){
            this.geometry.setFromPoints([pA, pB]);
        }
        const pbpa = pB.sub(pA);
        const dist = pbpa.length()
        pbpa.normalize();
        const vbva: Vector3 = this.particleB.getVelocity().clone().sub(this.particleA.getVelocity());
        const force = pbpa.multiplyScalar(this.elasticity * (dist - this.restingDist) + this.damping * vbva.dot(pbpa))
        return particle === this.particleA ? force : force.negate();
    }
    
    public getMesh(): Line {
        return this.mesh;

    }
    public delete() {
        this.mesh.geometry.dispose();
        if (this.mesh.material instanceof Material) {
            this.mesh.material.dispose();
        }
        this.mesh.parent?.remove(this.mesh);
    }
}