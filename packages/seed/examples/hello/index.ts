import create from "../../src/create";
import devtool from "../../src/devtoolMiddleware";

const seed = create({
  state: {
    list: ["1", "2", "3"],
    rand: Math.random(),
  },
  middleware: [devtool],
});

seed.set({
  list: ["4"],
});

console.log(seed.get());

setInterval(() => {
  seed.set({
    rand: Math.random(),
  });
}, 1500);
