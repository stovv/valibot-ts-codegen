import {string, number, boolean, array, object, union, map, record, set} from 'valibot';

export const SomeType = object({
  str: string(),
  num: number(),
  arr: array(number()),
  unionT: union([number(),string(),boolean()]),
});

export const SomeType2 = object({
  str: map(string(), number()),
  str2: record(string(), number()),
  str3: set(number()),
  num: number(),
  arr: array(number()),
});

