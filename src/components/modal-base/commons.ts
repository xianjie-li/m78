import { TupleNumber } from 'm78/modal-base/types';

/** 根据alignment值获取x, y值 */
export function calcAlignment(alignment: TupleNumber, screenMeta: TupleNumber) {
  const [sW, sH] = screenMeta;
  const [aX, aY] = alignment;

  const x = sW * aX;
  const y = sH * aY;

  return [x, y];
}

/*
 * 基础 api 介绍 套娃
 * */
