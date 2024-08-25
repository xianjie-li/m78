import { fn1, fn2, fn3, fn4, state } from "./conten.js";

interface State<S, A> {
  state: S;
  actions: A;
}

interface Instance<S, A> {
  state: S;
  actions: A;
  getSeed(): Instance<S, A>;
}

function create<S, A>(s: State<S, A>): Instance<S, A> {
  const ins = {
    state: s.state,
    actions: s.actions,
    getSeed() {
      return ins;
    },
  };
  return ins;
}

export const seede = create({
  state: state,
  actions: {
    fn1,
    fn2,
    inner: {
      fn3,
      fn4,
    },
  },
});

seede.actions.inner.fn4();
