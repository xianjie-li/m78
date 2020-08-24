export function calcAlignment(alignment: [number, number], screenMeta: [number, number]) {
  const [sW, sH] = screenMeta;
  const [aX, aY] = alignment;

  const x = sW * aX;
  const y = sH * aY;

  return [x, y];
}
