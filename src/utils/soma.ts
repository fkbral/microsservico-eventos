export const soma = (...numeros: number[]) =>
  numeros.reduce((acc: number, numero) => numero + acc, 0);
