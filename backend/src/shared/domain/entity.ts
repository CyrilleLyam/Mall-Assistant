export abstract class Entity {
  protected constructor(readonly id: string) {}

  equals(other: Entity): boolean {
    return this.id === other.id;
  }
}
