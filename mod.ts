import * as lodash from "https://deno.land/x/lodash@4.17.19/dist/lodash.min.js";

export class TakoKV {
  constructor(
    public DenoKV: unknown
  ) {
    
  }

  before: any = {}; // before database
  current: any = {}; // current databse

  update(): boolean {

    if (lodash.isEqual(this.before, this.current)) {
      return false;
    } // Non Update

    // Update Start

    // Update End
    
    this.before = this.current; // Executed
    return true;
  }
}