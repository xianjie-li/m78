import React from "react";
import { render } from "../utils";
import { i18n, useTranslation, Translation } from "../../src/i18n";
import { m78Config } from "../../src/config";

function App() {
  const { t } = useTranslation("common", { i18n });

  const loadCN = async () => {
    const zhCN = await import("../../src/i18n/locales/zh-CN.json");

    m78Config.set({
      i18n: {
        lng: "zh-CN",
        appendResource: {
          "zh-CN": zhCN,
        },
      },
    });
  };

  return (
    <div>
      <span>12312</span>
      <button onClick={loadCN}>load</button>
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

render(<App />);
