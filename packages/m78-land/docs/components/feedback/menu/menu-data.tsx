import { IconLightbulb } from "@m78/icons/icon-lightbulb.js";
import { IconContentPaste } from "@m78/icons/icon-content-paste.js";
import { IconCopyAll } from "@m78/icons/icon-copy-all.js";
import { IconTravelExplore } from "@m78/icons/icon-travel-explore.js";
import { IconComputer } from "@m78/icons/icon-computer.js";
import { IconInsertDriveFile } from "@m78/icons/icon-insert-drive-file.js";
import { IconHistory } from "@m78/icons/icon-history.js";
import { IconExitToApp } from "@m78/icons/icon-exit-to-app.js";
import React from "react";
import { Divider, MenuOption } from "m78";

export const menuData: MenuOption[] = [
  {
    label: "显示上下文操作",
    leading: <IconLightbulb />,
  },
  {
    label: "粘贴",
    leading: <IconContentPaste />,
  },
  {
    label: "复制",
    leading: <IconCopyAll />,
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
        leading: <IconTravelExplore />,
      },
      {
        label: "终端",
        leading: <IconComputer />,
      },
    ],
  },
  {
    customer: <Divider key="divider2" margin={8} />,
  },
  {
    label: "本地历史",
    leading: <IconInsertDriveFile />,
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
    leading: <IconExitToApp />,
  },
];
