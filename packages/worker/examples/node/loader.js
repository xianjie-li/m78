import { createRandString, delay } from "@m78/utils";

export function calc(a, b) {
  return a + b;
}

export function createString() {
  return createRandString();
}

export async function calc2(a, b) {
  await delay(2000);
  return a + b;
}
