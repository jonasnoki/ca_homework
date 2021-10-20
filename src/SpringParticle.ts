import {Particle} from "./Particle";
import {Spring} from "./Spring";

export class SpringParticle extends Particle {
    private springs: Spring[] = [];

    public addSpring(spring: Spring) {
        this.springs.push(spring);
    }

    public updateParticle(dt: number, method: string) {
        this.springs.forEach(spring => this.addForce(spring.calcForce(this)));
        super.updateParticle(dt, method);
    }

    public delete() {
        this.springs.forEach(s => s.delete())
        this.springs = [];
        super.delete();
    }
}