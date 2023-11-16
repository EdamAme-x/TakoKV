export interface KValue {
  key: string[];
  value: any;
  versionstamp: number;
}

export interface Table {
  [key: string]: any[], // Column Name
  id: number[]
}

export type DB = Record<string, Table | {
  [key: string]: any[]
}>; // table
