import React from 'react';
interface PaginationProps {
    /** 当前页码 */
    page?: number;
    /** 1 | 默认页码(非受控模式时使用) */
    defaultPage?: number;
    /** 页码改变时触发 */
    onChange?: (page: number) => void;
    /** 0 | 总数 */
    total?: number;
    /** 10 | 每页条数 */
    pageSize?: number;
    /** 朴素模式 */
    plain?: boolean;
    /** 简洁模式，只保留基础的上下页和跳页功能 */
    simple?: boolean;
    /** 组件可选大小 */
    size?: 'small';
    /** 开启跳页器 */
    jumper?: boolean;
    /** 开启页码改变器 TODO: 和DropDown一起开放 */
    /** 开启总条数统计 */
    count?: boolean;
    /** 禁用 */
    disabled?: boolean;
    /** 替换下一页图标或文本 */
    nextText?: React.ReactNode;
    /** 替换上一页图标或文本 */
    prevText?: React.ReactNode;
    /**
     * 生成a链接, 用于SEO优化, 只在SSR阶段生效，SSR渲染结束后后变更会变回按钮式分页
     * 如传入: '/news/{page}', 则会为每一项生成对应路径的a链接,
     * 可用变量有 {page}/{pageSize} */
    linkPattern?: string;
}
declare const Pagination: (props: PaginationProps) => JSX.Element;
export default Pagination;
