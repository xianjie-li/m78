import { TransitionTypes } from '@lxjx/react-transition-spring';

export type TupleNumber = [number, number];

export interface ModalBaseProps {
  /** 默认显示状态，与show同时使用时无效 */
  defaultShow?: boolean;
  /** 手动控制modal的显示/隐藏, 与onClose搭配作为受控模式使用 */
  show?: boolean;
  /** 显示状态发生改变时触发 */
  onClose?: any;
  /** 自定义挂载节点的明明空间 */
  namespace?: string;
  /** true | 是否显示遮罩 */
  mask?: boolean;
  /** 'light' | mask主题色 */
  maskTheme?: 'dark' | 'light';
  /** [0.5, 0.5] | 指定x/y轴位置, 值为 -1 ~ 1, 例：[0.5, 0.5] -> 居中， [1, 0] -> 右上， [1, 1] -> 右下 */
  alignment?: TupleNumber;
  /** 动画类型, 默认从光标位置出现 */
  animationType?: TransitionTypes;
  /** true | 开启后内容会在Modal开启时才进行渲染，关闭后内容随Modal一起渲染, 并根据show状态决定是否显示 */
  mountOnEnter?: boolean;
  /** false | Modal关闭后是否卸载其内容 */
  unmountOnExit?: boolean;
}
