import { EventEmitter } from "events";

import { AnyEntity } from "../entity/any-entity.type";
import { EntityType } from "../entity/entity-type.interface";
import { META } from "../symbols";
import { BerryOrm } from "./berry-orm.class";

const events = ["resolve", "update"] as const;

type EntityEvent = typeof events[number];
type Listener<Entity extends AnyEntity> = (entity: Entity) => void;

export class EntityEventManager {
  private emitter = new EventEmitter();

  constructor(private orm: BerryOrm) {}

  on<Entity extends AnyEntity>(
    target: EventTarget<Entity>,
    event: EntityEvent,
    listener: Listener<Entity>,
  ): this {
    this.emitter.on(this.identify(target, event), listener);
    return this;
  }

  once<Entity extends AnyEntity>(
    target: EventTarget<Entity>,
    event: EntityEvent,
    listener: Listener<Entity>,
  ): this {
    this.emitter.once(this.identify(target, event), listener);
    return this;
  }

  off<Entity extends AnyEntity>(
    target: EventTarget<Entity>,
    event: EntityEvent,
    listener: Listener<Entity>,
  ): this;
  off<Entity extends AnyEntity>(
    target: EventTarget<Entity>,
    event: EntityEvent,
  ): this;
  off<Entity extends AnyEntity>(target: EventTarget<Entity>): this;
  off(): void;
  off<Entity extends AnyEntity>(
    target?: EventTarget<Entity>,
    event?: EntityEvent,
    listener?: Listener<Entity>,
  ): this {
    if (target && event && listener) {
      this.emitter.off(this.identify(target, event), listener);
    } else if (target && event) {
      const id = this.identify(target, event);
      const listeners = this.emitter.listeners(id) as Listener<Entity>[];
      listeners.forEach((listener) => this.off(target, event, listener));
    } else if (target) {
      events.forEach((event) => this.off(target, event));
    } else {
      this.emitter.removeAllListeners();
    }
    return this;
  }

  emit(entity: AnyEntity, event: EntityEvent): this {
    const type = entity.constructor as EntityType;
    this.emitter.emit(this.identify(entity, event), entity);
    this.emitter.emit(this.identify(type, event), entity);
    this.emitter.emit(this.identify("any", event), entity);

    return this;
  }

  private identify<Entity extends AnyEntity>(
    target: EventTarget<Entity>,
    event: EntityEvent,
  ) {
    if (typeof target == "string") {
      return `${target}:${event}`;
    } else if (target instanceof Function) {
      const name = target.name;
      return `${name}:${event}`;
    } else {
      const name = target.constructor.name;
      const pk = target[target[META].primary];
      return `${name}:${pk}:${event}` as const;
    }
  }
}

type EventTarget<Entity extends AnyEntity = AnyEntity> =
  | Entity
  | EntityType<Entity>
  | "any";
