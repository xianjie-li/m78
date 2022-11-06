import { createEvent } from "@m78/hooks";

/** 某个窗口点击时通知其他窗口更新zIndex, 传入触发窗口的id */
export const updateZIndexEvent = createEvent<(id: string) => void>();
