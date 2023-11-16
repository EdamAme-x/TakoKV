export interface KValue {
  key: string[],
  value: any,
  versionstamp: number
}

export interface DB {
  [key: string]: {
    [key: string]: any[] | number, // column & row
    id: number // id
  } // table
}