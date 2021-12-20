import { EventEmitter } from "events";

import { AnyEntity } from "../entity/any-entity.type";
import { META } from "../symbols";
import { BerryOrm } from "./berry-orm.class";

const events = ["resolve", "update"] as const;

type EntityEvent = typeof events[number];
type Listener<Entity extends AnyEntity<Entity>> = (entity: Entity) => void;

export class EntityEventManager {
  private emitter = new EventEmitter();

  constructor(private orm: BerryOrm) {}

  on<Entity extends AnyEntity<Entity>>(
    entity: AnyEntity<Entity>,
    event: EntityEvent,
    listener: Listener<Entity>,
  ): this {
    this.emitter.on(this.identify(entity, event), listener);
    return this;
  }

  once<Entity extends AnyEntity<Entity>>(
    entity: AnyEntity<Entity>,
    event: EntityEvent,
    listener: Listener<Entity>,
  ): this {
    this.emitter.once(this.identify(entity, event), listener);
    return this;
  }

  off<Entity extends AnyEntity<Entity>>(
    entity: AnyEntity<Entity>,
    event: EntityEvent,
    listener: Listener<Entity>,
  ): this;
  off<Entity extends AnyEntity<Entity>>(
    entity: AnyEntity<Entity>,
    event: EntityEvent,
  ): this;
  off<Entity extends AnyEntity<Entity>>(entity: AnyEntity<Entity>): this;
  off(): void;
  off<Entity extends AnyEntity<Entity>>(
    entity?: AnyEntity<Entity>,
    event?: EntityEvent,
    listener?: Listener<Entity>,
  ): this {
    if (entity && event && listener) {
      this.emitter.off(this.identify(entity, event), listener);
    } else if (entity && event) {
      const id = this.identify(entity, event);
      const listeners = this.emitter.listeners(id) as Listener<Entity>[];
      listeners.forEach((listener) => this.off(entity, event, listener));
    } else if (entity) {
      events.forEach((event) => this.off(entity, event));
    } else {
      this.emitter.removeAllListeners();
    }
    return this;
  }

  emit(entity: AnyEntity, event: EntityEvent): this {
    this.emitter.emit(this.identify(entity, event), entity);
    return this;
  }

  private identify(entity: AnyEntity, event: EntityEvent) {
    const name = entity.constructor.name;
    const pk = entity[entity[META].primary];
    return `${name}:${pk}:${event}` as const;
  }
}
