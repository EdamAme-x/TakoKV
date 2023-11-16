import * as lodash from "https://deno.land/x/lodash@4.17.19/dist/lodash.min.js";
import { DB, KValue } from "./mod.d.ts";

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
      this.KV.set(["_takokv_last"], Date.now()) // last update
    }

    this._setup();
  }

  async _setup() {

    const tables = await this.KV.list({ prefix: ["_takokv_db"] });

    this.before = {};
    for await (const table of tables {
      this.before[table.key[1]] = table.value;
      // { {TableName: string}: {TableValue: any} }
    })
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
    
  createTable(tableName: string): boolean {
    if (!this.current[tableName]) {
      this.current[tableName] = {};
      return true;
    }
    return false;
  }
  
  async update(): boolean {
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
