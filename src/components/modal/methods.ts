import { calcAlignment } from './commons';
import { InstanceItem, Share, TupleNumber } from './types';

export function useMethods(share: Share) {
  const {
    instances,
    clickAwayClosable,
    namespace,
    mask,
    show,
    cIndex,
    contRef,
    alignment,
    setPos,
    setShow,
    onClose,
    triggerNode,
    modalSize,
    self,
  } = share;

  /** 从传入的same instance中获取namespace相同的，只有它们才有比较的价值 */
  function realSameInstance(ins: InstanceItem[]) {
    return ins.filter(item => (item.meta.namespace = namespace));
  }

  /** 根据该组件所有已渲染实例判断是否应开启mask */
  function maskShouldShow() {
    if (!mask || !show) return false;

    // 当前实例之前所有实例组成的数组
    const before = instances.slice(0, cIndex);

    // 在该实例之前是否有任意一个实例包含mask
    const beforeHasMask = realSameInstance(before).some(item => item.meta.mask);

    return !beforeHasMask;
  }

  /** 根据前后实例判断是否需要触发Away点击关闭 */
  function shouldTriggerClose() {
    if (!show || !clickAwayClosable) return false;

    const afterInstance = instances.slice(cIndex + 1);

    const afterHasAwayClosable = realSameInstance(afterInstance).some(
      item => item.meta.clickAwayClosable,
    );

    return !afterHasAwayClosable;
  }

  /** 屏幕尺寸改变/容器尺寸改变时调用 */
  function calcPos() {
    // useMeasure获取的尺寸是无边框尺寸，这里手动获取带边框等的实际尺寸
    const w = contRef.current ? contRef.current.offsetWidth : modalSize[0];
    const h = contRef.current ? contRef.current.offsetHeight : modalSize[1];

    const screenMeta: TupleNumber = [window.innerWidth - w, window.innerHeight - h];

    const pos = calcAlignment(alignment, screenMeta);

    setPos(pos);

    const [x, y] = pos;

    self.px = x;
    self.py = y;
  }

  /** 在未被阻止时关闭此Modal */
  function close() {
    if (share.refState.shouldTriggerClose) {
      setShow(false);
      onClose?.();
    }
  }

  /** 启用Modal */
  function open() {
    setShow(true);
  }

  /** triggerNode事件绑定器 */
  function onTriggerNodeClick(e: MouseEvent) {
    triggerNode?.props?.onClick?.(e);
    share.refState.show ? close() : open();
  }

  return {
    maskShouldShow,
    shouldTriggerClose,
    calcPos,
    close,
    open,
    onTriggerNodeClick,
  };
}
