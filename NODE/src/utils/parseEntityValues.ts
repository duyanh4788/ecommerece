import { EntityType, PayloadEntity } from '../interface/ItemsInterface';
import { enCryptFakeId } from './fakeid';

export const parseEntityValues = (data: any) => {
  if (!data) return;
  let getEntity: any = {};
  for (let key of Object.keys(data)) {
    if (typeof data[key] === 'object') {
      getEntity = data[key];
    }
  }
  const entity: PayloadEntity = {};
  let keyEntity: any;
  for (let keyX of Object.keys(EntityType)) {
    for (let keyY of Object.keys(data)) {
      if (keyX === keyY) {
        keyEntity = keyY;
      }
    }
  }
  for (let key of Object.keys(getEntity.dataValues)) {
    if (key !== 'createdAt' && key !== 'updatedAt') {
      entity[key] = getEntity.dataValues[key];
    }
  }
  entity.id = enCryptFakeId(entity.id);
  entity.entityId = enCryptFakeId(entity.entityId);
  return { keyEntity, result: entity };
};
