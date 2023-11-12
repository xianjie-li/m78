import { IconTips } from "@m78/icons/tips.js";
import { IconClipboard } from "@m78/icons/clipboard.js";
import { IconCopy } from "@m78/icons/copy.js";
import { IconFind } from "@m78/icons/find.js";
import { IconTerminal } from "@m78/icons/terminal.js";
import { IconHistoryQuery } from "@m78/icons/history-query.js";
import { IconHistory } from "@m78/icons/history.js";
import { IconLogout } from "@m78/icons/logout.js";
import React from "react";
import { Divider, MenuOption } from "m78";

export const menuData: MenuOption[] = [
  {
    label: "显示上下文操作",
    leading: <IconTips />,
  },
  {
    label: "粘贴",
    leading: <IconClipboard />,
  },
  {
    label: "复制",
    leading: <IconCopy />,
  },
  {
    customer: <Divider key="divider1" margin={8} />,
  },
  {
    label: "存储为",
  },
  {
    label: "打开于",
    children: [
      {
        label: "文件浏览器",
        leading: <IconFind />,
      },
      {
        label: "终端",
        leading: <IconTerminal />,
      },
    ],
  },
  {
    customer: <Divider key="divider2" margin={8} />,
  },
  {
    label: "本地历史",
    leading: <IconHistoryQuery />,
    children: [
      {
        label: "查看",
      },
      {
        label: "更新",
      },
    ],
  },
  {
    label: "Git",
    leading: <IconHistory />,
    children: [
      {
        label: "拉取",
      },
      {
        label: "提交",
      },
      {
        label: "暂存",
      },
    ],
  },
  {
    label: "退出",
    leading: <IconLogout />,
  },
];
