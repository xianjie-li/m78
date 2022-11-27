export async function copyToClipboard(text: string) {
  if (!("clipboard" in navigator)) {
    alert("sorry! 你的浏览器不支持navigator.clipboard API");
    return Promise.reject();
  }

  return navigator.clipboard.writeText(text).then(() => {
    Promise.resolve();
  });
}
