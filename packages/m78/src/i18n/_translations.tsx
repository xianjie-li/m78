import {
  Trans as TransLib,
  Translation as TranslationLib,
  useTranslation as useTranslationLib,
} from "react-i18next";
import React from "react";
import { i18n } from "./index";

export const useTranslation: typeof useTranslationLib = (...params) => {
  return useTranslationLib(params[0], {
    ...params[1],
    i18n,
  });
};

export const Translation: typeof TranslationLib = (props) => {
  return (
    <TranslationLib {...props} i18n={i18n}>
      {props.children}
    </TranslationLib>
  );
};

export const Trans: typeof TransLib = (props) => {
  return <TransLib {...props} i18n={i18n} />;
};
