import Tower from "./gameElements/towers/tower.ts";
import Projectile from "./gameElements/projectiles/projectile.ts";
import { Movable } from "../geometry/movable.ts.ts";
import Sprite from "../GUI/sprite.ts";

export default class GameState {
    private towers: Map<number, Tower>;
    private projectiles: Map<number, Projectile>;
    private mobs: Map<number, Movable>;

    constructor() {
        this.towers = new Map();
        this.projectiles = new Map();
        this.mobs = new Map();
    }

    public getTowers(): ReadonlyMap<number, Tower> {
        return this.towers; 
    }

    public getProjectiles(): ReadonlyMap<number, Projectile> {
        return this.projectiles;
    }

    public getMobs(): ReadonlyMap<number, Movable> {
        return this.mobs;
    }

    public addTower(id: number, tower: Tower) {
        this.towers.set(id, tower);
    }

    public removeTower(id: number) {
        this.towers.delete(id);
    }

    public addProjectile(id: number, projectile: Projectile) {
        this.projectiles.set(id, projectile);
    }

    public removeProjectile(id: number) {
        this.projectiles.delete(id);
    }

    public addMob(id: number, mob: Movable) {
        this.mobs.set(id, mob);
    }

    public removeMob(id: number) {
        this.mobs.delete(id);
    }

     
    public *iterateEntities<T>(entities: Map<number, T>): IterableIterator<T> {
        for (const entity of entities.values()) {
            yield entity;
        }
    }

        /**
     * Unified iterator to loop over **all** entities (towers, projectiles, and mobs).
     */
        public *getAllEntities(): IterableIterator<Sprite> {
            yield* this.iterateEntities(this.towers);
            yield* this.iterateEntities(this.projectiles);
            yield* this.iterateEntities(this.mobs);
        }

}
