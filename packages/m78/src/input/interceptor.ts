import { Interceptor } from "./types.js";
import { isNumber } from "@m78/utils";

export const _number: Interceptor = ({ str }) => {
  if (str === "-") return str;
  const num = Number(str);
  if (isNaN(num)) return false;
  return str;
};

export const _integer: Interceptor = ({ str }) => {
  const ind = str.indexOf(".");

  if (ind !== -1) return false;

  return str;
};

export const _positive: Interceptor = ({ str }) => {
  const ind = str.indexOf("-");

  if (ind !== -1) return false;

  return str;
};

export const _numberRange: Interceptor = ({ str, props }) => {
  const num = Number(str);

  if (isNaN(num)) return str;

  if (isNumber(props.min) && num < props.min) {
    return String(props.min);
  }

  if (isNumber(props.max) && num > props.max) {
    return String(props.max);
  }

  return str;
};
