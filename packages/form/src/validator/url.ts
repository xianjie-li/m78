import { FormValidator } from "../types.js";

function isUrl(url: string) {
  return /^((https?|ftp|git|ws):\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/.test(
    url
  );
}

export const urlValidatorKey = "VerifyUrl";

/**
 * 是否为有效url
 * */
export const url = () => {
  const urlValidator: FormValidator = ({ value, config }) => {
    if (!isUrl(value)) return config.languagePack.url;
  };

  urlValidator.key = urlValidatorKey;

  return urlValidator;
};
