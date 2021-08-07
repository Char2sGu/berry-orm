import { BaseEntity } from "../base-entity.class";
import { container } from "../container";
import { EntityMetaHelper } from "../entity-meta-helper.class";

export const PrimaryKey = () => (prototype: BaseEntity, name: string) => {
  container.get(EntityMetaHelper).addField(prototype, name, true);
};
