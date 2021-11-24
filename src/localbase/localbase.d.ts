declare module 'localbase' {
  export function get(options?: {
    keys: boolean;
  }): any;
  export class get {
    constructor(options?: {
      keys: boolean;
    });
    getCollection: () => any;
    getDocument: () => any;
    getDocumentByCriteria: () => any;
    getDocumentByKey: () => any;
  }

  export function update(docUpdates: any): any;
  export class update {
    constructor(docUpdates: any);
    updateDocumentByCriteria: () => void;
    updateDocumentByKey: () => void;
  }

  export function set(newDocument: any, options?: {
    keys: boolean;
  }): any;
  export class set {
    constructor(newDocument: any, options?: {
      keys: boolean;
    });
    setCollection: () => void;
    setDocument: () => void;
    setDocumentByCriteria: () => void;
    setDocumentByKey: () => void;
  }

  export function limit(limitBy: any): this;
  export class limit {
    constructor(limitBy: any);
    limitBy: any;
  }

  export function orderBy(property: any, direction: any): this;
  export class orderBy {
    constructor(property: any, direction: any);
    orderByProperty: string | undefined;
    orderByDirection: any;
  }

  export function collection(collectionName: any): this;
  export class collection {
    constructor(collectionName: any);
    collectionName: string | undefined;
  }

  export function doc(docSelectionCriteria: any): this;
  export class doc {
    constructor(docSelectionCriteria: any);
    docSelectionCriteria: any;
  }

  export default class Localbase {
    constructor(dbName: any);
    dbName: any;
    lf: {};
    collectionName: any;
    orderByProperty: any;
    orderByDirection: any;
    limitBy: any;
    docSelectionCriteria: any;
    deleteCollectionQueue: {
      queue: never[];
      running: boolean;
    };
    config: {
      debug: boolean;
    };
    userErrors: any[];
    collection: typeof collection;
    doc: typeof doc;
    orderBy: typeof orderBy;
    limit: typeof limit;
    get: typeof get;
    add: typeof add;
    update: typeof update;
    set: typeof set;
    delete: typeof deleteIt;
  }
}