/// <reference types="react" />
import { DNDProps } from './types';
/**
 * 与其他DND库的有所不同:
 *  - 基于元素位置的拖动, 放置时，可以识别放置的具体位置如上、右、下、左、中, 以此实现更为精细的拖放控制
 *  - 无入侵, 你可以在不更改现有dom结构的前提下增加拖动行为
 *  - 启发式的拖动组件，与传统的DND库(Draggable/Droppable)有所不同，此库通过一个单一的`<DND />`组件来完成拖动/放置操作，因为很多时候元素可能即是拖动目标、也是放置目标
 *  - 同时支持移动、pc
 *
 * 基本演示
 *    一个基础的多方向拖动示例:
 *      - 通过`DNDContext`将`DND`组件分组(可选但推荐，无分组的`DND`状态会管理在一组默认状态中, 通常`DND`不需要接收事件，而是直接使用`DNDContext`来进行事件管理)
 *      - 通过enableDrop选择要启用的反向
 *      - 根据render children接收的状态来调整盒子拖放元素内容、绑定拖放节点
 *      - 作为拖动元素时，`DND`会触发拖动目标相关的事件，作为放置目标时，`DND`会触发放置目标相关的事件
 * 各种状态的使用演示/内置简单样式
 * 网格demo - 方向演示
 * 看板 - 多列拖动
 * 网格拖动动画demo - 如何添加动画完全基于你的想象力，基于绝对定位布局的动画

 * 禁用 - 禁止拖动、禁止防止
 * 自动滚动


 * 自定义拖动把手
 * 自定义拖拽物/ 简单定制、节点定制
 * 持久化变更
 * */
declare function DND<Data = any, TData = Data>(props: DNDProps<Data, TData>): JSX.Element;
declare namespace DND {
    var defaultProps: {
        enableDrag: boolean;
        enableDrop: boolean;
    };
}
export default DND;
