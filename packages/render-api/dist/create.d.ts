import { RenderApiInstance, RenderApiOption } from "./types";
/**
 * 接收配置并创建一个api实例
 * - S - 组件能够接收的状态, 对应实现组件的扩展props
 * - I - 组件扩展api
 * @param opt - 创建配置
 * */
declare function create<S extends object, I = null>(opt: RenderApiOption<S>): RenderApiInstance<S, I>;
export default create;
//# sourceMappingURL=create.d.ts.map