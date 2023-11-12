import { MenuOption } from "../../src/menu/types.js";
import { Divider } from "../../src/layout/index.js";
import { IconLike } from "@m78/icons/like";
import React from "react";

const IconLightbulb = IconLike;
const IconContentPaste = IconLike;
const IconCopyAll = IconLike;
const IconTravelExplore = IconLike;
const IconComputer = IconLike;
const IconInsertDriveFile = IconLike;
const IconHistory = IconLike;
const IconExitToApp = IconLike;

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
  {
    label: "选项1",
  },
  {
    label: "选项2",
  },
  {
    label: "选项3",
  },
  {
    label: "选项4",
  },
  {
    label: "选项5",
  },
  {
    label: "选项6",
  },
  {
    label: "选项7",
  },
  {
    label: "选项8",
  },
  {
    label: "选项9",
  },
  {
    label: "选项10",
  },
];
