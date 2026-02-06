export type DexEntry = {
  dexnum: string;
  name: string;
  type1: string;
  type2?: string | null;
  region?: string;
};

export type Region = {
  id: number;
  name: string;
};
