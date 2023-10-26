## [Valibot](https://valibot.dev) TS codegen

Tool for autogenerate simple schema for valibot

### Getting started
First you need to install
```
yarn add valibot-ts-codegen
```

After installing add command to package.json

```json5
{
  // ...
  "scripts": {
    // ...
    "gen-valibot-schemas": "vtc --path ./**/*.ts --result ./valibot-schemas.ts"
    // ...
  },
  // ...
}
```

#### Supported types
- string
- number
- bigint
- boolean
- null
- symbol
- undefined
- array
- object
- date
- map
- record
- set
- tuple
- union
- unknown
- void
- never
- any

#### Not supported
- multiline union
  ```ts
  type NotSupportedUnion = {
    u: string 
      | number
      | boolean;
  }
  ```
- enum
- intersection
