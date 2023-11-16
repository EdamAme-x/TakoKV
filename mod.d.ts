export interface KValue {
  key: string[];
  value: any;
  versionstamp: number;
}

export type DB = Record<string, {
  [key: string]: any[]; // column & row
  id: number[]; // id
} | {
  [key: string]: any[]
}>; // table
