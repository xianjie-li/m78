import React, { useEffect, useMemo, useState } from "react";
import CodeBlock from "@theme/CodeBlock";
import { Button, ButtonColor } from "m78/button";
import { IconCode } from "@m78/icons/icon-code";
import { IconCheck } from "@m78/icons/icon-check";
import { IconClose } from "@m78/icons/icon-close";
import { IconContentCopy } from "@m78/icons/icon-content-copy";
import { Size } from "m78/common";

import BrowserOnly from "@docusaurus/BrowserOnly";

import css from "./style.module.scss";
import { ensureArray, isString } from "@m78/utils";
import { useSelf } from "@m78/hooks";
import { copyToClipboard } from "../../common/common";

interface DemoCodeItem {
  /** 代码内容 */
  code: string;
  /** 文件名 */
  name?: string;
  /** 代码类型, 默认为typescript */
  language?: string;
}

interface DemoProps {
  /** 待渲染的demo区域 */
  demo:
    | React.ReactNode
    | React.ComponentType<any>
    // 允许传require返回值
    | { default: React.ComponentType<any> };
  /** 关联的文件内容 */
  code?:
    | Array<DemoCodeItem>
    | DemoCodeItem
    | { default: string } /* 允许传require返回值 */
    | string /* 允许直接传入代码 */;
}

const copySuccessIcon = <IconCheck className="color-success" />;
const copyFailIcon = <IconClose className="color-error" />;

const Demo = ({ demo, code }: DemoProps) => {
  const [codeOpen, setCodeOpen] = useState(false);

  const { list, first } = useMemo(() => {
    if (!code) return { list: [] as DemoCodeItem[], first: null };

    const ls = ensureArray(code).map((i) => {
      if (isString(i)) {
        return { code: i };
      }

      if (isString((i as any).code)) {
        return i;
      }

      return {
        ...i,
        code: (i as any)?.default || (i as any)?.code?.default || "",
      };
    }) as any as Array<Omit<DemoCodeItem, "code"> & { code: string }>;

    return {
      list: ls,
      first: ls[0],
    };
  }, [code]);

  const [cur, setCur] = useState(first);

  const [copyIcon, setCopyIcon] = useState(() => <IconContentCopy />);

  const self = useSelf({
    t: null as any,
    isUnmount: false,
  });

  useEffect(
    () => () => {
      self.isUnmount = true;
      clearCopyTimer();
    },
    []
  );

  function copy(s: string) {
    clearCopyTimer();

    copyToClipboard(s)
      .then(() => setCopyIcon(copySuccessIcon))
      .catch(() => setCopyIcon(copyFailIcon))
      .finally(() => {
        self.t = setTimeout(clearCopyTimer, 800);
      });
  }

  function clearCopyTimer() {
    clearTimeout(self.t);
    if (self.isUnmount) return;
    setCopyIcon(<IconContentCopy />);
  }

  function renderDemo() {
    if (React.isValidElement(demo)) {
      return demo;
    } else {
      // 支持直接传require结果
      const DemoCom: any = (demo as any)?.default || demo;
      return <DemoCom />;
    }
  }

  return (
    <div className={css.demo}>
      <div className={css.main}>{renderDemo()}</div>
      <div className={css.toolbar}>
        <div role="tablist" className={css.tab}>
          {codeOpen &&
            list.map((i, index) => {
              const isSelected = cur === i;
              return (
                i.name && (
                  <Button
                    role="tab"
                    aria-selected={isSelected}
                    key={index}
                    text
                    color={isSelected ? ButtonColor.primary : undefined}
                    onClick={() => setCur(i as any)}
                  >
                    {i.name}
                  </Button>
                )
              );
            })}
        </div>
        <div>
          <Button icon size={Size.small} onClick={() => copy(cur?.code || "")}>
            {copyIcon}
          </Button>
          <Button
            icon
            size={Size.small}
            color={codeOpen ? ButtonColor.primary : undefined}
            onClick={() => setCodeOpen((p) => !p)}
          >
            <IconCode />
          </Button>
        </div>
      </div>

      {cur && codeOpen && (
        <div className={css.code}>
          <CodeBlock language={cur.language || "tsx"}>{cur.code}</CodeBlock>
        </div>
      )}
    </div>
  );
};

export default Demo;
