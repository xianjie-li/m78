import { Size } from "@lxjx/utils";
import { _MediaQueryTypeContext, MediaQueryMeta, MediaQueryObject, MediaQueryTypeKeys } from "./types";
/**
 * 根据尺寸检测是何种类型
 * */
export declare function _calcType(size: number): MediaQueryTypeKeys;
/**
 * 抽取onChange公共逻辑
 * 如果传入了skipEmit，会跳过通知Listeners并改为返回meta对象
 * */
export declare function _onChangeHandle({ width, height }: Size, ctx: _MediaQueryTypeContext, skipEmit?: boolean): MediaQueryMeta | undefined;
/**
 * 根据 { [MediaQueryTypeKeys]: T } 格式的对象获取当前尺寸下符合条件的值
 * 为了减少断点书写，断点包含一套继承机制，较小值会继承较大值
 * @param meta - 媒体查询源信息
 * @param mq - 包含MediaQueryTypeKeys配置的对象
 * @param fullback - 没有任何匹配的回退值
 * @param checker - 自定义T是否生效，默认检测其是否为undefined
 * @param reverse - 以相反的方向继承
 * @return t - 满足当前媒体条件的值
 * */
export declare function _mediaQueryGetter<T>(meta: MediaQueryMeta, mq: MediaQueryObject<T>, fullback: T, checker?: (item?: T) => boolean, reverse?: boolean): T;
//# sourceMappingURL=common.d.ts.map