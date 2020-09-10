import React from 'react';
import { ModalBaseApi, ModalBaseProps } from './types';
declare const _ModalBase: React.FC<ModalBaseProps>;
declare const api: ({ singleton, ...props }: ModalBaseApi & import("@lxjx/react-render-api/dist").ReactRenderApiExtraProps) => [import("@lxjx/react-render-api/dist").ReactRenderApiInstance<ModalBaseApi>, string];
declare type Modal = typeof _ModalBase;
interface ModalBaseWithApi extends Modal {
    api: typeof api;
}
declare const Modal: ModalBaseWithApi;
export default Modal;
