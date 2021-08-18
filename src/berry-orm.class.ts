import { AnyEntity } from ".";
import { EntityManager } from "./entity-manager.class";
import { EntityType } from "./entity/entity-type.type";
import { IdentityMapManager } from "./entity/identity-map-manager.class";

export class BerryOrm {
  readonly em;

  constructor({ entities }: { entities: EntityType<AnyEntity>[] }) {
    const identityMapManager = new IdentityMapManager(entities);
    this.em = new EntityManager(identityMapManager);
  }
}
