export type Order = {
  id: number;
  tokens: {
    [key: string]: number;
  };
};
