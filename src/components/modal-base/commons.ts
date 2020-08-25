import { TupleNumber } from 'm78/modal-base/types';

export function calcAlignment(alignment: TupleNumber, screenMeta: TupleNumber) {
  const [sW, sH] = screenMeta;
  const [aX, aY] = alignment;

  const x = sW * aX;
  const y = sH * aY;

  return [x, y];
}
