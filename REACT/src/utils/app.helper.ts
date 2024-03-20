/* eslint-disable no-useless-concat */
/* eslint-disable array-callback-return */
import { EntityValuesInterface, ItemsInterface, ItemsType } from 'interface/Items.mode';
import * as _ from 'lodash';
import { faker } from '@faker-js/faker';

import moment from 'moment';

export class AppHelper {
  /**
   * Format queryParams Url
   * @param  {String} url queryString
   * @return {Object} format query parameter
   */

  static formmatDateTime(dateTime) {
    if (!dateTime) return '-';
    return moment(dateTime).format('DD-MM-YYYY - HH:mm');
  }

  static convertFullName(name: string | any) {
    if (!name) return 'G';
    return name.split(' ').pop().charAt(0) + name.split(' ').shift().charAt(0);
  }

  static truncate(text: string, length: number): string {
    if (text.length > length) return text.substring(0, length) + '...';
    else return text;
  }

  static checkLinkHttp(text: string) {
    if (_.isEmpty(text)) return null;
    if (text.length) {
      for (let item of text) {
        if (item.indexOf('http://') === 0 || item.indexOf('https://') === 0) return true;
      }
    } else return false;
    if (text.indexOf('http://') === 0 || text.indexOf('https://') === 0) return true;
    else return false;
  }

  /**
   * Text To TitleCase
   * @param   { String } str string text input
   * @returns { String } string text to TitleCase
   */

  static toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  static capitalizeFirstLetter(string: string): string {
    if (!string) return '';
    const slpit = string.split('_')[0];
    return slpit.charAt(0).toUpperCase() + slpit.slice(1);
  }

  static generateUUID(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  static randomNumber(min: number = 1000000, max: number = 5000000): number {
    return Math.floor(Math.random() * (max - min) + min);
  }

  static getFirstLastName(fullName: string): any {
    const name: string[] = fullName.split(/(?:\/)([^#]+)(?=#*)/);
    return {
      firstName: name[1],
      lastName: name[0],
    };
  }

  static convertStringToDate(date: string) {
    if (!date) return '';
    const convert = date.split('/').reverse().join('-');
    return convert;
  }

  static isEmpty(obj): boolean {
    if (!obj) return false;
    return Object.keys(obj).length ? true : false;
  }

  static validateExpired(expired: number) {
    return expired - 30000 <= new Date().getTime();
  }

  static ramdomColImg() {
    return Math.floor(Math.random() * 2) + 1;
  }

  static compareArrayProducts(arrA: any[], arrB: any[]): boolean {
    if (
      (!arrA && arrB.length) ||
      (!arrA.length && arrB.length) ||
      (arrA && arrA.length !== arrB.length)
    )
      return false;
    if ((!arrA.length && !arrB.length) || (arrA && arrA.length && !arrB.length)) return true;
    let res: any[] = [];
    for (let itemB of arrB) {
      const isCheck = arrA.find(itemA => itemA.id === itemB.id);
      if (!isCheck) {
        res.push(itemB);
      }
    }
    if (res.length) return false;
    return true;
  }

  static textTruncate(text: string) {
    if (!text || text === '') return null;
    if (text.length < 10) {
      return text;
    } else {
      const truncatedText = text.slice(0, 10) + ' ...';
      return truncatedText;
    }
  }

  static parseItemObject(item: ItemsInterface) {
    if (!item || !item.entityValues) return;
    const entityKeys = [
      'entityCosmestics',
      'entityFunitures',
      'entityElectronics',
      'entityClothers',
    ];
    let clone = { ...item };
    let itemChildId: any;
    for (let key of entityKeys) {
      if (clone && clone.entityValues && clone.entityValues[key]) {
        const entity = clone.entityValues[key];
        itemChildId = entity.id;
        const { id, ...restEntity } = entity;
        clone = { ...clone, ...restEntity };
        delete clone.entityValues;
        break;
      }
    }
    return { ...clone, itemChildId };
  }

  static validateString(text: string | any) {
    if (!text || text === '') return false;
    return true;
  }

  static validateNumber(num: number | any) {
    if (!num) return false;
    return true;
  }

  static handleEntityValue(entityValues: EntityValuesInterface) {
    if (entityValues.entityClothers) return 'entityClothers';
    if (entityValues.entityCosmestics) return 'entityCosmestics';
    if (entityValues.entityElectronics) return 'entityElectronics';
    if (entityValues.entityFunitures) return 'entityFunitures';
  }

  static ranDomeImg() {
    const characters = [
      'abstract',
      'animals',
      'cats',
      'city',
      'fashion',
      'food',
      'nightlife',
      'sports',
      'technics',
    ];
    const randomIndex = Math.floor(Math.random() * characters.length);
    let result: string[] = [];
    for (let i = 0; i <= 5; i++) {
      result.push(faker.image.urlLoremFlickr({ category: characters[randomIndex] }));
    }
    return result;
  }

  static fakerPayloadItems(shopId: string, productId: string) {
    if (!productId || !shopId) return;
    return {
      shopId,
      productId,
      nameItem: faker.commerce.productName(),
      itemThumb: this.ranDomeImg(),
      description: faker.commerce.productDescription(),
      prices: faker.commerce.price(),
      quantityStock: faker.number.int(30),
      brandName: faker.company.name(),
      origin: faker.location.country(),
    };
  }

  static fakerPayloadEntity(typeProduct: string | null) {
    if (!typeProduct) return;
    if (typeProduct === ItemsType.CLOTHES) {
      return {
        color: faker.color.human(),
        material: faker.airline.recordLocator(),
        size: faker.airline.recordLocator(),
        styleList: faker.airline.recordLocator(),
      };
    }
    if (typeProduct === ItemsType.FUNITURES) {
      return {
        size: faker.airline.recordLocator(),
        material: faker.airline.recordLocator(),
        manufactury: faker.lorem.words(3),
        funtion: faker.lorem.words(3),
        warranty: faker.datatype.boolean(),
      };
    }
    if (typeProduct === ItemsType.COSMETICS) {
      return {
        volume: `${faker.number.int(30)}/ml`,
        weight: `${faker.number.int(30)}/gr`,
        activesIngredients: faker.lorem.words(5),
        expiry: `${faker.number.int(30)}/month`,
      };
    }
    if (typeProduct === ItemsType.ELECTRONICS) {
      return {
        color: faker.color.human(),
        storage: `${faker.number.int(300)}/GB`,
        screenSize: `${faker.number.int(300)}/inch`,
        weight: `${faker.number.int(30)}/gr`,
        technology: faker.lorem.word(),
        warranty: faker.datatype.boolean(),
      };
    }
  }
}
