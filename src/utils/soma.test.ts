import { expect, test } from "vitest";
import { soma } from "./soma";

test("Devo poder somar números", () => {
  expect(soma(1, 3)).toEqual(4);
});

test("Devo poder somar 5 números", () => {
  expect(soma(1, 3, 8, 10, 6)).toEqual(28);
});
