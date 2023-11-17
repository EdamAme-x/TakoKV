import lodash from "https://esm.sh/lodash";
import { DB, KValue, Table } from "./mod.d.ts";

export class TakoKV {
  constructor(
    public KV: any & {
      set: Function;
      get: Function;
    }, // Temp Type
  ) {
    const init: KValue = this.KV.get(["_takokv_init"]);
    if (!init.value) {
      this.KV.set(["_takokv_init"], true);
      this.KV.set(["_takokv_db"], {}); // tables
      this.KV.set(["_takokv_last"], Date.now()); // last update
    }
  }

  async setup(): Promise<void> {
    const tables = await this.KV.list({ prefix: ["_takokv_db"] });

    this.before = {};
    for await (const table of tables) {
      this.before[table.key[1]] = table.value;
      // { {TableName: string}: {TableValue: any} }
    }
    this.current = Object.create(this.before);
  }

  before: DB = {}; // before database
  current: DB = {}; // current databse

  /** @Methods **/
  existTable(tableName: string): boolean {
    if (this.current[tableName]) {
      return true;
    }

    return false;
  }

  createTable(tableName: string, columns?: string[]): boolean {
    if (this.current[tableName]) {
      return false;
    } // if table exist

    this.current[tableName] = {}; // create empty table

    if (columns) {
      for (let i = 0; i < columns.length; i++ ) {
        this.current[tableName][columns[i]] = []; // create empty column
      }
    }
    
    return true;
  }

  createColumn(tableName: string, columnName: string): boolean {
    if (this.current[tableName][columnName]) {
      return false;
    } // Aleardy exist

    this.current[tableName][columnName] = []; // create column [row, row, row ...]

    return true;
  }

  insertRow(tableName: string, rowId: number, row: {
  [key: string]: any
 }): boolean {
      for (const key of Object.keys(row)) {
        if (!this.current[tableName][key]) {
          this.current[tableName][key] = Array(rowId).fill(undefined); // 追加
        }
        this.current[tableName][key].splice(rowId, 0, row[key]); // 追加
      }

      this._IDgen(tableName, this.current[tableName][Object.keys(row)[0]].length);

      return true;
  }

  getRows(tableName: string): number {
    return this.current[tableName].id.length;
  }

  getColumns(tableName: string): number {
    return Object.entries(this.current[tableName]).length; // id, ...col
  }

  getTable(tableName: string): Table {
    return this.current[tableName];
  }

  getCol<T = any>(tableName: string, columnName: string): T[] {
    return this.getTable(tableName)[columnName]
  }

  getSearchRow(tableName: string, columnName: string, searchValue: any): any[] | null {
    let tragetIndex = null;
    
   const searchResult: any[] | undefined = this.getTable(tableName)[columnName].find((row: any) => row === searchValue);

    if (searchResult === undefined) {
      return null;
    }

    return searchResult;
  } // 👹

  deleteColumn(tableName: string, columnName: string): boolean {
    delete this.current[tableName][columnName];
  }

  deleteRow(tableName: string, rowId: number) {
    for (const key of Object.keys(this.current[tableName])) {
      this.current[tableName][key] = this._removeAndShift(this.current[tableName][key], rowId);
    }
  }

  deleteTable(tableName: string) {
    delete this.current[tableName]
  }

  // @SysMethod

  _IDgen(tableName: string, length: number): void {
    this.current[tableName].id = [];
    for (let i = 0; i < length; i++) {
      this.current[tableName].id.push(i);
    }
  }

  _shiftArray(array: any[], index: number): any[] {
    for (let i = index; i < array.length - 1; i++) {
      array[i] = array[i + 1];
    }
    array[array.length - 1] = undefined; // empty (will insert)
    return array;
  } // subset

  _removeAndShift(arr: any[], index: number): any[] {
    arr.splice(index, 1);
    for (let i = index; i < arr.length; i++) {
      arr[i] = arr[i + 1];
    }
    arr.length--;
    return arr;
  }

  async update(): Promise<boolean> {
    if (lodash.isEqual(this.before, this.current)) {
      return false;
    } // Non Update

    for (const tableName of Object.keys(this.current)) {
      await this.KV.set(["_takokv_db", tableName], this.current[tableName]);
    }

    await this.KV.set(["_takokv_last"], Date.now()); // last update time

    this.before = Object.create(this.current); // Executed
    return true;
  }
}

/**
{
  ...tableName: {
    id: number[0, 1, 2, 3, 4...],
    name: {string : (any)}[]
  }
}
*/
