import * as lodash from "https://deno.land/x/lodash@4.17.19/dist/lodash.min.js";
import { KValue, DB } from "./mod.d.ts";

export class TakoKV {
  constructor(
    public KV: any & {
      set: Function,
      get: Function
    } // Temp Type
  ) {
    const init: KValue = this.KV.get(["_takokv_init"])
    if (!init.value) {
      this.KV.set(["_takokv_init"], true)
      this.KV.set(["_takokv_db"], {}) // tables
    }

    this.before = this.KV.get(["_takokv_db"])
    this.current = Object.create(this.before)
  }

  before: DB = {}; // before database
  current: DB = {}; // current databse

  update(): boolean {

    if (lodash.isEqual(this.before, this.current)) {
      return false;
    } // Non Update

    // Update Start
    this.KV.set(["_takokv_last"], Date.now()); // last update
    // Update End
    
    this.before = this.current; // Executed
    return true;
  }
}