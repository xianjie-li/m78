/**
 * 将xx-xx转换为XxXx
 * */
export function upName(s = "") {
  const sp = s.split("-");
  return sp.reduce((p, i) => {
    const first = (i[0] || "").toUpperCase();
    const s = first + i.slice(1);
    return p + s;
  }, "");
}
