let n = 0;
let charNum = 65;
let char = String.fromCharCode(charNum);

/** 获取相对该浏览器页签/node进程生命周期的唯一id */
export function createTempID(): string {
  const s = `${char}${n}`;

  n++;

  if (n >= Number.MAX_VALUE) {
    charNum++;
    char = String.fromCharCode(charNum);
  }

  return s;
}
