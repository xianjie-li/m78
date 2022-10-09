var storagePrefix = "UTIL_STORAGE_";
/** shortcut to the localStorage api, including automatic JSON.stringify and a spliced unique prefix */ export function setStorage(key, val) {
    localStorage.setItem("".concat(storagePrefix).concat(key).toUpperCase(), JSON.stringify(val));
}
/** shortcut of localStorage api, automatic JSON.parse, can only take the value set by setStorage */ export function getStorage(key) {
    var s = localStorage.getItem("".concat(storagePrefix).concat(key).toUpperCase());
    if (!s) return null;
    return JSON.parse(s);
}
