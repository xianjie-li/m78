const storagePrefix = "UTIL_STORAGE_";

/** shortcut to the localStorage api, including automatic JSON.stringify and a spliced unique prefix */
export function setStorage(key: string, val: any) {
  localStorage.setItem(
    `${storagePrefix}${key}`.toUpperCase(),
    JSON.stringify(val)
  );
}

/** shortcut of localStorage api, automatic JSON.parse, can only take the value set by setStorage */
export function getStorage(key: string) {
  const s = localStorage.getItem(`${storagePrefix}${key}`.toUpperCase());

  if (!s) return null;

  return JSON.parse(s);
}
