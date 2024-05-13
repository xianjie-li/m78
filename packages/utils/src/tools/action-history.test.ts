import { ActionHistory } from "./action-history.js";

test("ActionHistory", () => {
  const history = new ActionHistory();

  const list = [1, 2, 3, 4];

  history.redo({
    redo() {
      list.splice(1, 1);
    },
    undo() {
      list.splice(1, 0, 2);
    },
  });

  expect(list).toEqual([1, 3, 4]);

  history.undo();

  expect(list).toEqual([1, 2, 3, 4]);

  history.ignore(() => {
    history.redo({
      redo() {
        list.push(5, 6);

        history.redo({
          redo() {
            list.push(7, 8);
          },
          undo() {},
        });
      },
      undo() {},
    });
  });

  expect(list).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  // @ts-ignore
  expect(history.history.length).toBe(1);

  history.batch(() => {
    history.redo({
      redo() {
        list.push(9);

        history.redo({
          redo() {
            list.push(10);
          },
          undo() {
            list.splice(list.length - 1, 1);
          },
        });
      },
      undo() {
        list.splice(list.length - 1, 1);
      },
    });

    history.redo({
      redo() {
        list.push(11);

        history.redo({
          redo() {
            list.push(12);
          },
          undo() {
            list.splice(list.length - 1, 1);
          },
        });
      },
      undo() {
        list.splice(list.length - 1, 1);
      },
    });
  });

  expect(list).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

  // undo后push新内容, 之前的历史会被清理, 所以这里是1
  // @ts-ignore
  expect(history.history.length).toBe(1);

  history.undo();

  expect(list).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);

  history.redo();

  expect(list).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

  history.undo();

  expect(list).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);

  // @ts-ignore
  expect(history.history.length).toBe(1);

  try {
    history.batch(() => {
      history.batch(() => {});
    });
  } catch (e: any) {
    expect(e.message).toBe(
      "Can't call batch() inside another batch() or ignore()"
    );
  }

  try {
    history.ignore(() => {
      history.batch(() => {});
    });
  } catch (e: any) {
    expect(e.message).toBe(
      "Can't call batch() inside another batch() or ignore()"
    );
  }

  const history2 = new ActionHistory();

  history2.enable = false;

  const h2Redo = jest.fn();
  const h2Undo = jest.fn();

  history2.redo({
    redo: h2Redo,
    undo: h2Undo,
  });

  // 下面这些操作应该都是无效的
  history2.redo();
  history2.redo();
  history2.undo();
  history2.undo();

  history2.batch(() => {
    history2.redo();
    history2.redo();
  });

  history2.ignore(() => {
    history2.redo();
    history2.redo();
  });
  // 上面这些操作应该都是无效的

  expect(h2Redo).toBeCalledTimes(1);
  expect(h2Undo).toBeCalledTimes(0);
});
