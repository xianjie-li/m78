import { TABLE_NS, Translation } from "../../i18n/index.js";
import { Bubble } from "../../bubble/index.js";
import { Button } from "../../button/index.js";
import { IconDownloadTwo } from "@m78/icons/download-two.js";
import React from "react";
import { IconUploadTwo } from "@m78/icons/upload-two.js";
import { RCTablePlugin } from "../plugin.js";
import { _useStateAct } from "../injector/state.act.js";

export class _XLSHandlePlugin extends RCTablePlugin {
  toolbarTrailingCustomer(nodes: React.ReactNode[]) {
    const props = this.getProps();
    const { dataOperations: conf } = this.getDeps(_useStateAct);

    if (props.dataExport) {
      nodes.push(<ExportFileBtn />);
    }

    if (props.dataImport && conf.add) {
      nodes.push(<ImportFileBtn />);
    }
  }
}

function ExportFileBtn() {
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
          <Button squareIcon>
            <IconUploadTwo />
          </Button>
        </Bubble>
      )}
    </Translation>
  );
}

function ImportFileBtn() {
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
          <Button squareIcon>
            <IconDownloadTwo />
          </Button>
        </Bubble>
      )}
    </Translation>
  );
}
