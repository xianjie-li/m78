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
});
