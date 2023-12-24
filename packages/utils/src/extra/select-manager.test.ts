import { SelectManager } from "./select-manager.js";

describe("SelectManager", () => {
  const mockList = (length: number) =>
    Array.from({ length }).map((_, ind) => ({
      id: ind,
    }));

  test("base", () => {
    const select = new SelectManager({
      list: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    });

    select.select(2);
    select.select(6);

    expect(select.getState().selected).toEqual([2, 6]);
  });

  test("full", () => {
    const list = mockList(100);

    const select = new SelectManager<number>({
      list,
      valueMapper: "id",
    });

    const cb = jest.fn(() => {});

    select.changeEvent.on(cb);

    expect(select.getValueByItem({ id: 50 })).toBe(50);

    expect(select.isWithinList(50)).toBe(true);

    expect(select.isWithinList(100)).toBe(false);

    expect(select.isSelected(0)).toBe(false);

    expect(select.partialSelected).toBe(false);

    select.select(0);

    expect(select.isSelected(0)).toBe(true);

    expect(select.partialSelected).toBe(true);

    select.unSelect(0);

    expect(select.isSelected(0)).toBe(false);

    select.unSelectAll();

    expect(select.getState().selected).toEqual([]);

    select.selectAll();

    expect(select.getState().selected).toEqual(list.map((i) => i.id));

    select.toggle(50);

    expect(select.getState().selected).toEqual(
      list.map((i) => i.id).filter((i) => i !== 50)
    );

    select.toggleAll();

    expect(select.getState().selected).toEqual([50]);

    select.setAllSelected([10, 20, 30]);

    expect(select.getState().selected).toEqual([10, 20, 30]);

    select.setSelected(20, false);
    select.setSelected(40, true);

    expect(select.getState().selected).toEqual([10, 30, 40]);

    select.selectList([50, 60]);
    select.unSelectList([10, 30]);

    expect(select.getState().selected).toEqual([40, 50, 60]);

    expect(select.getState().originalSelected).toEqual([
      {
        id: 40,
      },
      {
        id: 50,
      },
      {
        id: 60,
      },
    ]);

    expect(cb.mock.calls.length).toBe(11);

    // setList & strangeSelected

    select.selectAll();

    const nList = mockList(98);

    select.setList(nList);

    select.selectAll();

    expect(select.getState().realSelected).toEqual([
      40,
      50,
      60,
      ...nList.map((i) => i.id).filter((i) => ![40, 50, 60, 98].includes(i)),
    ]);

    expect(select.getState().strangeSelected).toEqual([98, 99]);

    expect(select.getState().originalSelected).toEqual([
      {
        id: 40,
      },
      {
        id: 50,
      },
      {
        id: 60,
      },
      ...nList
        .map((_, id) => ({ id: id }))
        .filter((i) => ![40, 50, 60].includes(i.id)),
      // 怪异选项没有实际值, 会以原值作为输出
      98,
      99,
    ]);

    expect(select.getState().selected).toEqual([
      40,
      50,
      60,
      ...nList.map((i) => i.id).filter((i) => ![40, 50, 60].includes(i)),
      98,
      99,
    ]);

    select.select(123);

    expect(select.getState().strangeSelected).toEqual([98, 99, 123]);

    expect(cb.mock.calls.length).toBe(15);
  });

  test("large list", () => {
    const startTime = Date.now();

    const list = mockList(999999);

    console.time("use-select large list");

    const select = new SelectManager({
      list,
      valueMapper: "id",
    });

    select.select(500000);

    select.toggleAll();

    expect(select.getState().selected.length).toBe(999998);

    expect(Date.now() - startTime).toBeLessThan(1000);

    console.timeEnd("use-select large list");
  });
});
