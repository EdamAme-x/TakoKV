export interface KValue {
  key: string[];
  value: any;
  versionstamp: number;
}

export type DB = Record<string, {
  [key: string]: any[] | number; // column & row
  id: number; // id
} | {}>; // tablet
