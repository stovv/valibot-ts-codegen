export type SomeType = {
  str: string;
  num: number;
  arr: number[];
  unionT: number | string | boolean;
}

export type SomeType2 = {
  str: Map<string, number>;
  str2: Record<string, number>;
  str3: Set<number>;
  num: number;
  arr: number[];
}

export interface  SomeInterface {
  str: string;
  num: number;
  arr: number[];
}