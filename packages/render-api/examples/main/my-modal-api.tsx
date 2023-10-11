import React, { useEffect, useImperativeHandle, useState } from "react";
import clsx from "clsx";
import create from "../../dist";

import sty from "./my-modal.module.css";
import { RenderApiComponentProps } from "../../dist";

// 过滤几个关键api

/* 组件接收状态，同时也是api调用时的参数 */
export interface MyModalState
  extends RenderApiComponentProps<
    MyModalState,
    {
      name: string;
      doSomething: () => string;
    }
  > {
  /** 弹窗标题 */
  title: string;
  /** 弹窗内容 */
  content: React.ReactNode;
}

/* 实现api组件, api会向其传入RenderApiComponentBaseProps格式的prop */
const MyModal = ({
  open = false,
  title,
  content,
  onChange,
  instanceRef,
}: MyModalState) => {
  const [show1, setShow] = useState(false);

  // 故意通过useEffect制造延迟
  useEffect(() => setShow(open), [open]);

  useImperativeHandle(
    instanceRef,
    () => {
      return {
        name: "foo",
        doSomething: () => "bar",
      };
    },
    []
  );

  return (
    <div className={clsx(sty.MyModal, show1 ? sty.Open : sty.Close)}>
      <div className={sty.Title}>
        <span>{title}</span>
        <span className={sty.CloseBtn} onClick={() => onChange?.(false)}>
          close
        </span>
      </div>
      <div className={sty.Content}>{content}</div>
    </div>
  );
};

/* 使用组实现件创建api */
const MyModalApi = create<
  MyModalState,
  { name: string; doSomething: () => string }
>({
  component: MyModal,
});

export default MyModalApi;
