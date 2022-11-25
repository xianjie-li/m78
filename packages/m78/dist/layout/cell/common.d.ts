import { MediaQueryMeta } from "../media-query/types";
import { CellColMediaQueryProps, CellColProps } from "./types";
/**
 * 根据MediaQueryMeta从GridColProps中获取GridColMediaQueryProps
 * 获取遵循以下规则:
 * - 当前媒体尺寸不包含有效配置时，从小于此区间的媒体尺寸中依次获取并拿到第一个有效配置
 * - 当任何区间都不能获取到有效值时，获取直接传入的配置
 * - 如下所示
 * - xxl.col > md.col > xs.col > props.col
 * - xxl.offset > md.offset > xs.offset > props.offset
 * */
export declare function _getCurrentMqProps(mqMeta: MediaQueryMeta, { col, offset, move, order, flex, hidden, align, xs, sm, md, lg, xl, xxl, className, style, }: CellColProps): CellColMediaQueryProps;
//# sourceMappingURL=common.d.ts.map