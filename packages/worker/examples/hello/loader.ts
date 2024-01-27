import { createRandString, delay } from "@m78/utils";

export function calc(a: number, b: number) {
  return a + b;
}

export function createString() {
  return createRandString();
}

export async function calc2(a: number, b: number) {
  await delay(2000);
  return a + b;
}
