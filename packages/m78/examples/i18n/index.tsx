import React from "react";
import { i18n, useTranslation, Translation } from "../../src/i18n";

export function I18NExample() {
  const { t } = useTranslation("common", { i18n });

  return (
    <div>
      <span>12312</span>
      <span>{t("submit")}</span>
      <span>{t("button:test")}</span>
      <Translation>
        {(t) => {
          return <span>{t("button:test")}</span>;
        }}
      </Translation>
      {/*<Trans count={count}>*/}
      {/*  hello <span>world</span> {count} 21321*/}
      {/*</Trans>*/}
    </div>
  );
}
