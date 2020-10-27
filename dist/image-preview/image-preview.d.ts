import React from 'react';
import { ReactRenderApiProps } from '@lxjx/react-render-api';
export interface ImagePreviewProps extends ReactRenderApiProps {
    /** 图片数据 */
    images?: {
        img: string;
        desc?: string;
    }[];
    /** 初始页码，组件创建后页码会由组件内部管理，当page值改变时会同步到组件内部 */
    page?: number;
}
declare const _ImagePreview: React.FC<ImagePreviewProps>;
declare const api: ({ singleton, ...props }: ImagePreviewProps & import("@lxjx/react-render-api/dist").ReactRenderApiExtraProps) => [import("@lxjx/react-render-api/dist").ReactRenderApiInstance<ImagePreviewProps>, string];
declare type ImagePreview = typeof _ImagePreview;
interface ImagePreviewWithApi extends ImagePreview {
    api: typeof api;
}
declare const ImagePreview: ImagePreviewWithApi;
export default ImagePreview;
