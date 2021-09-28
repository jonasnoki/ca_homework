import {Vector3, Plane, Mesh, SphereGeometry, MeshNormalMaterial} from "three";

export class Particle {
    private currentPosition: Vector3 = new Vector3();
    private previousPosition: Vector3 = new Vector3();
    private velocity: Vector3 = new Vector3();
    private force: Vector3 = new Vector3();

    private bouncing: number = 0;
    private lifetime: number = 0;
    private fixed: boolean = false;

    public mesh: Mesh;

    constructor(x: number, y: number, z: number, geometry = new SphereGeometry(1),material = new MeshNormalMaterial(), ) {
        this.currentPosition.set(x, y, z);
        this.mesh = new Mesh(geometry, material);
    }

    // setters
    public setPosition(x: number, y: number, z: number): void {
        this.currentPosition.set(x, y, z);
    };

    public setPreviousPosition(x: number, y: number, z: number): void {
        this.previousPosition.set(x, y, z)
    };

    public setVelocity(x: number, y: number, z: number): void {
        this.velocity.set(x, y, z)
    };

    public setForce(x: number, y: number, z: number): void {
        this.velocity.set(x, y, z)
    };

    public setBouncing(bouncing: number): void {
        this.bouncing = bouncing;
    };

    public setLifetime(lifetime: number): void {
        this.lifetime = lifetime;
    };

    public setFixed(fixed: boolean): void {
        this.fixed = fixed;
    };


    //getters
    public getCurrentPosition(): Vector3 {
        return this.currentPosition
    };


    public getPreviousPosition(): Vector3 {
        return this.previousPosition
    };

    public getVelocity(): Vector3 {
        return this.velocity
    };


    public getBouncing(): number {
        return this.bouncing
    };

    public getLifetime(): number {
        return this.lifetime
    };

    public isFixed(): boolean {
        return this.fixed;
    };


    public addForce(force: Vector3) {
        this.force.add(force);
    }

    public updateParticle(dt: number) {
        if (!this.fixed) {
            // EulerSemi
            this.previousPosition = this.currentPosition;
            this.velocity = this.velocity.addScaledVector(this.force,dt);
            this.currentPosition = this.currentPosition.addScaledVector(this.velocity, dt);
            //TODO: implement Verlet


            this.mesh.position.set(this.currentPosition.x, this.currentPosition.y, this.currentPosition.z);
        }

        return;
    }

    public collisionParticlePlane(p: Plane) {
        let sign: number;
        // TODO: check the following calculation:

        sign = this.currentPosition.dot(p.normal) + p.constant;
        // sign = glm::dot(m_currentPosition, p.normal) + p.d;
        sign *= this.previousPosition.dot(p.normal) + p.constant;
        // sign *= glm::dot(m_previousPosition, p.normal) + p.d;

        return sign <= 0

    }

    public correctCollisionParticlePlain(p: Plane) {
        // TODO: check the following calculation especially what p.d refers to???:
        // the original implementation is like this: 	float d = -glm::dot(point, normal);
        // implementation of threejs confirms that it is the same: 		this.constant = - point.dot( this.normal );
        // m_currentPosition = m_currentPosition - (1 + m_bouncing) * (glm::dot(m_currentPosition, p.normal) + p.d) * p.normal;
        this.currentPosition = this.currentPosition.sub((p.normal as Vector3).multiplyScalar(((1 + this.bouncing) * (this.currentPosition.dot(p.normal) + p.constant)))) ;
        // m_velocity = m_velocity - (1 + m_bouncing) * (glm::dot(m_velocity, p.normal) + p.d) * p.normal;
        this.velocity = this.velocity.sub((p.normal as Vector3).multiplyScalar(((1 + this.bouncing) * (this.velocity.dot(p.normal) + p.constant)))) ;
    }

}