import { TABLE_NS, Translation } from "../../i18n/index.js";
import { Bubble } from "../../bubble/index.js";
import { Button } from "../../button/index.js";
import { IconFileDownload } from "@m78/icons/icon-file-download.js";
import React from "react";
import { IconFileUpload } from "@m78/icons/icon-file-upload.js";

export function _ExportFileBtn() {
  return (
    <Translation ns={TABLE_NS}>
      {(t) => (
        <Bubble
          content={
            <div>
              <div>{t("export xlsx")}</div>
              <div className="fs-12 color-second">
                {t("u can also")} <a>{t("export specific")}</a>
              </div>
            </div>
          }
        >
          <Button className="color-second" squareIcon>
            <IconFileDownload />
          </Button>
        </Bubble>
      )}
    </Translation>
  );
}

export function _ImportFileBtn() {
  return (
    <Translation ns={TABLE_NS}>
      {(t) => (
        <Bubble
          content={
            <div>
              {t("import")}
              <div className="fs-12 color-second">
                <a>{t("download import tpl")}</a>
              </div>
            </div>
          }
        >
          <Button className="color-second" squareIcon>
            <IconFileUpload />
          </Button>
        </Bubble>
      )}
    </Translation>
  );
}
