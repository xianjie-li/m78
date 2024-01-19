console.log(123);

addEventListener("message", (e) => {
  console.log(3, performance.now());
  console.log(e.data);
});
