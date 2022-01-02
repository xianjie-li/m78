import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import create, { RenderApiComponentProps } from '@m78/render-api';

import sty from './my-modal.module.css';

/* 组件接收状态(props)，同时也是api调用时的参数 */
interface MyModalState extends RenderApiComponentProps<MyModalState> {
  /** 弹窗标题 */
  title: string;
  /** 弹窗内容 */
  content: React.ReactNode;
}

/* 实现api组件, api会向其传入RenderApiComponentBaseProps类型的prop, 由MyModalState和instance组成 */
const MyModal = ({
  title,
  content,
  // render api注入的props
  show = false,
  onChange,
}: MyModalState) => {
  const [aShow, setAShow] = useState(false);
  // 故意通过useEffect制造延迟, 延迟设置show以实现css动画效果
  // 实际场景中, 通常会有更复杂的动画实现方式, 通过open变更触发动画即可
  useEffect(() => {
    setAShow(show);
  }, [show]);

  return (
    <div className={clsx(sty.MyModal, aShow ? sty.Open : sty.Close)}>
      <div className={sty.Title}>
        <span>{title}</span>
        {/* 通过api在组件内更改组件的状态 */}
        <span className={sty.CloseBtn} onClick={() => onChange?.(false)}>
          close
        </span>
      </div>
      <div className={sty.Content}>{content}</div>
    </div>
  );
};

/* 使用组实现件创建api */
const MyModalApi = create<MyModalState>({
  component: MyModal,
});

export default MyModalApi;
