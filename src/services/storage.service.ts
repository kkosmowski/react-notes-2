import Localbase from 'localbase';
import { EntityUid } from '../domain/types/entity-uid.type';
import { LocalbaseRequest } from '../localbase/localbase-request.interface';

export class StorageService {
  static init(): void {
    if (!window.indexedDB) {
      throw new Error('This app requires IndexedDB support.');
    }
  }

  static get<T>(collection: string, findBy: Partial<T>): Promise<T> {
    const db = new Localbase('db');
    return db.collection(collection).doc(findBy).get();
  }

  static getAll<T>(collection: string, order?: 'desc' | 'asc'): Promise<T> {
    const db = new Localbase('db');
    if (order) {
      return db.collection(collection).orderBy(order).get();
    }
    return db.collection(collection).get();
  }

  static async add<T>(collection: string, value: T): Promise<T> {
    const db = new Localbase('db');
    await db.collection(collection).add(value);
    return value;
  }

  static async update<T>(collection: string, findBy: Partial<T> | null, value: Partial<T>): Promise<T> {
    const db = new Localbase('db');
    let req: LocalbaseRequest<T>;

    if (findBy) {
      req = await db.collection(collection).doc(findBy).update(value);
    } else {
      req = await db.collection(collection).update(value);
    }

    return req.data;
  }

  static async set<T>(collection: string, findBy: Partial<T> | null, value: T): Promise<T> {
    const db = new Localbase('db');
    let req: LocalbaseRequest<T>;

    if (findBy) {
      req = await db.collection(collection).doc(findBy).set(value);
    } else {
      req = await db.collection(collection).set(value);
    }

    return req.data;
  }

  static async delete(collection: string, id: EntityUid): Promise<void> {
    const db = new Localbase('db');
    await db.collection(collection).doc({ id }).delete();
  }
}