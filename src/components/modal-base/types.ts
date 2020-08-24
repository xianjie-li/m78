export interface ModalBaseProps {
  show?: boolean;
  onClose?: any;
  namespace?: string;
  mask?: boolean;
  maskTheme?: 'dark' | 'light';
  align?:
    | 'center'
    | 'centerLeft'
    | 'centerRight'
    | 'top'
    | 'topLeft'
    | 'topRight'
    | 'bottom'
    | 'bottomLeft'
    | 'bottomRight';
  /** 指定xy轴位置, 值为 -1 ~ 1 */
  alignment?: [number, number];
  /** false | 设置alignment时，以元素中心为原点 */
  alignmentCenter?: boolean;
  /** 动画类型 */
  animationType?: 'fade' | 'zoom' | 'slide' | 'formPointer';
}
