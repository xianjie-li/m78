import { FormValidator } from "../types.js";

function isEmail(email: string) {
  return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(
    email
  );
}

export const emailValidatorKey = "VerifyEmail";

/**
 * 是否为有效email
 * */
export const email = () => {
  const emailValidator: FormValidator = ({ value, config }) => {
    if (!isEmail(value)) return config.languagePack.email;
  };

  emailValidator.key = emailValidatorKey;

  return emailValidator;
};
