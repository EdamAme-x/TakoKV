# TakoKV
DenoKV's wrapper library / kv query library
(We also make adapters for VercelKV and other KVs.)

どこかの軟体生物の人の為に作ります

![TakoKV-Logo](/assets/takoKV.svg)

## Examples

```ts
import { TakoKV } from "https://deno.land/x/takokv/mod.ts";

const tako = new TakoKV(await Deno.openKv());
await tako.setup();

/** Set / Create **/

tako.createTable("members"); // only id
tako.createColumn("members", "name"); // add name column
tako.createColumn("members", "password"); // add password column

const datas: {
  name: string,
  password: string
}[] = [
  {
    name: "Amex",
    password: "a"
  },
  {
    name: "Tako",
    password: "t"
  }
]

for (let i = 0; i < datas.length; i++ ) {
  tako.insertRow("members", i, "name", datas[i].name);
  tako.insertRow("members", i, "password", datas[i].password);
}

/** Get **/
const rows: number = tako.getRows("members"); // 2 (Amex..., Tako...)
const columns: number = tako.getColmuns("members"); // 3 (id, name, password)

// Add Last Row
tako.insertRow("members", rows + 1, {
  "name": "Octo",
  "password": "o"
});

await tako.update() // Patch

const MemberList: {
  id: number[],
  name: string[],
  password: string[]
} = tako.getTable("members"); // from Table

for(let i = 0; i < MemberList.id.length; i++) {
  console.log(`${MemberList.id[i]}: ${MemberList.name[i]} ${MemberList.password[i]}`);
}

const NameList: string[] = tako.getCol("members", "name"); // from Column in Table

NameList.forEach(name => {
  console.log(`${name}`);
  /*
  ** Amex 
  ** Tako
  ** Octo
  **/
})

const firstUser: string[] | false = tako.getRow("members", "id", 0); // Search by row value from column in Table

console.log(firstUser ?? firstUser[0]); // Amex

// Delete
tako.deleteColumn("members", "password");
await tako.update(); // Update KV

const MemberList2: {
  id: number[],
  name: string[],
} = tako.getTable("members");

// MemberList2.id.length : Rows num

for(let i = 0; i < MemberList2.id.length; i++) {
  console.log(`${row.id[i]}: ${row.name[i]}`);
  /*
  ** 0: Amex 
  ** 1: Tako
  ** 2: Octo
  **/
}

const rows2: number = tako.getRows("members"); // 3 (Amex..., Tako..., Octo...)
tako.deleteRow("members", rows2 - 1); // delete Octo's Row
await tako.update(); // Update KV

const MemberList3: {
  id: number[],
  name: string[],
} = tako.getTable("members");

for(let i = 0; i < MemberList3.id.length; i++) {
  console.log(`${row.id}: ${row.name}`);
  /*
  ** 0: Amex 
  ** 1: Tako
  **/
}

tako.deleteTable("members"); // delete Table
await tako.update(); // Update KV

console.log(tako.getTable("members")); // null
```

| id | name | password|
|---|---|---|
|0|Amex|a|
|1|Tako|t|
|2|Octo|o|
