import React from "react";
import { useSelect } from "@m78/hooks";

function fakeOptions(num: number) {
  return Array.from({ length: num }).map((_, index) => ({
    label: `选项${index + 1}`,
    value: index + 1,
  }));
}

const opt = fakeOptions(200000);

const UseSelectDemo = () => {
  const select = useSelect<{ value: number; disabled?: boolean }>({
    list: opt,
    valueMapper: (item) => item.value,
  });

  const state = select.state;

  return (
    <div>
      <div>
        {opt.slice(0, 6).map((item) => (
          <label key={item.value}>
            <input
              type="checkbox"
              checked={select.isSelected(item.value)}
              onChange={({ target }) =>
                select.setSelected(item.value, target.checked)
              }
            />
            {item.label}
          </label>
        ))}
        等{opt.length}个选项...
      </div>
      <div>
        选中: {JSON.stringify(state.selected.slice(0, 6), null, 4)}{" "}
        {state.selected.length}+...
      </div>
      <div>
        原始选中: {JSON.stringify(state.originalSelected.slice(0, 6), null, 4)}
        ...
      </div>
      <div>是否全部选中: {select.allSelected.toString()}</div>
      <div>部分选中: {select.partialSelected.toString()}</div>
      Demo
      <br />
      <button onClick={() => select.select(1)}>select1</button>
      <button onClick={() => select.select(2)}>select2</button>
      <button onClick={() => select.select(3)}>select3</button>
      <button onClick={() => select.select(4)}>select4</button>
      <button onClick={() => select.select(5)}>select5</button>
      <br />
      <br />
      <button onClick={() => select.unSelect(1)}>unSelect1</button>
      <button onClick={() => select.unSelect(2)}>unSelect2</button>
      <button onClick={() => select.unSelect(3)}>unSelect3</button>
      <button onClick={() => select.unSelect(4)}>unSelect4</button>
      <button onClick={() => select.unSelect(5)}>unSelect5</button>
      <br />
      <br />
      <button onClick={() => select.toggle(1)}>toggle1</button>
      <button onClick={() => select.toggle(2)}>toggle2</button>
      <button onClick={() => select.toggle(3)}>toggle3</button>
      <button onClick={() => select.toggle(4)}>toggle4</button>
      <button onClick={() => select.toggle(5)}>toggle5</button>
      <br />
      <br />
      <div style={{ border: "1px solid red", padding: 16 }}>
        <button onClick={() => select.selectAll()}>selectAll</button>
        <button onClick={() => select.unSelectAll()}>unSelectAll</button>
        <button onClick={() => select.toggleAll()}>toggleAll</button>
        <div>高性能消耗</div>
      </div>
      <br />
      <br />
      <button onClick={() => console.log(select.isSelected(1))}>
        isSelected1
      </button>
      <button onClick={() => console.log(select.isSelected(2))}>
        isSelected2
      </button>
      <button onClick={() => console.log(select.isSelected(3))}>
        isSelected3
      </button>
      <button onClick={() => console.log(select.isSelected(4))}>
        isSelected4
      </button>
      <button onClick={() => console.log(select.isSelected(5))}>
        isSelected5
      </button>
      <br />
      <br />
      <button onClick={() => select.setAllSelected([1, 3])}>
        setAllSelected([1, 3])
      </button>
      <button onClick={() => select.setAllSelected([2, 4, 5])}>
        setAllSelected([2, 4, 5])
      </button>
      <br />
      <br />
      <button onClick={() => select.setSelected(1, true)}>
        setSelected(1, true))
      </button>
      <button onClick={() => select.setSelected(3, false)}>
        setSelected(3, false)
      </button>
      <br />
      <br />
      <button onClick={() => select.selectList([1, 2, 3, 4])}>
        selectList([1, 2, 3, 4])
      </button>
      <button onClick={() => select.unSelectList([3, 4, 5, 6])}>
        unSelectList([3, 4, 5, 6])
      </button>
    </div>
  );
};

export default UseSelectDemo;
