import React from 'react';
import { useCheck } from '@m78/hooks';

function fakeOptions(num: number) {
  return Array.from({ length: num }).map((_, index) => ({
    label: `选项${index + 1}`,
    value: index + 1,
  }));
}

const opt = fakeOptions(300000);

const UseCheckDemo = () => {
  const res = useCheck<number, { value: number; disabled?: boolean }>({
    options: opt,
    defaultValue: [1, 3],
    disables: [4],
    collector: (item) => item.value,
    onChange(v, o) {
      console.log('onChange', v, o);
    },
  });

  return (
    <div>
      <div>
        {opt.slice(0, 6).map((item) => (
          <label key={item.value}>
            <input
              type="checkbox"
              checked={res.isChecked(item.value)}
              onChange={({ target }) =>
                res.setCheckBy(item.value, target.checked)
              }
              disabled={res.isDisabled(item.value)}
            />
            {item.label}
          </label>
        ))}
        等{opt.length}个选项...
      </div>
      <div>
        选中: {JSON.stringify(res.checked.slice(0, 6), null, 4)}{' '}
        {res.checked.length}+...
      </div>
      <div>
        原始选中: {JSON.stringify(res.originalChecked.slice(0, 6), null, 4)}...
      </div>
      <div>是否全部选中: {res.allChecked.toString()}</div>
      <div>无任何值选中: {res.noneChecked.toString()}</div>
      <div>部分选中: {res.partialChecked.toString()}</div>
      Demo
      <br />
      <button onClick={() => res.check(1)}>check1</button>
      <button onClick={() => res.check(2)}>check2</button>
      <button onClick={() => res.check(3)}>check3</button>
      <button onClick={() => res.check(4)}>check4</button>
      <button onClick={() => res.check(5)}>check5</button>
      <br />
      <br />
      <button onClick={() => res.unCheck(1)}>unCheck1</button>
      <button onClick={() => res.unCheck(2)}>unCheck2</button>
      <button onClick={() => res.unCheck(3)}>unCheck3</button>
      <button onClick={() => res.unCheck(4)}>unCheck4</button>
      <button onClick={() => res.unCheck(5)}>unCheck5</button>
      <br />
      <br />
      <button onClick={() => res.toggle(1)}>toggle1</button>
      <button onClick={() => res.toggle(2)}>toggle2</button>
      <button onClick={() => res.toggle(3)}>toggle3</button>
      <button onClick={() => res.toggle(4)}>toggle4</button>
      <button onClick={() => res.toggle(5)}>toggle5</button>
      <br />
      <br />
      <div style={{ border: '1px solid red', padding: 16 }}>
        <button onClick={() => res.checkAll()}>checkAll</button>
        <button onClick={() => res.unCheckAll()}>unCheckAll</button>
        <button onClick={() => res.toggleAll()}>toggleAll</button>
        <span style={{ fontSize: 12, color: '#666' }}>高性能消耗</span>
      </div>
      <br />
      <br />
      <button onClick={() => console.log(res.isChecked(1))}>isChecked1</button>
      <button onClick={() => console.log(res.isChecked(2))}>isChecked2</button>
      <button onClick={() => console.log(res.isChecked(3))}>isChecked3</button>
      <button onClick={() => console.log(res.isChecked(4))}>isChecked4</button>
      <button onClick={() => console.log(res.isChecked(5))}>isChecked5</button>
      <br />
      <br />
      <button onClick={() => console.log(res.isDisabled(1))}>
        isDisabled1
      </button>
      <button onClick={() => console.log(res.isDisabled(2))}>
        isDisabled2
      </button>
      <button onClick={() => console.log(res.isDisabled(3))}>
        isDisabled3
      </button>
      <button onClick={() => console.log(res.isDisabled(4))}>
        isDisabled4
      </button>
      <button onClick={() => console.log(res.isDisabled(5))}>
        isDisabled5
      </button>
      <br />
      <br />
      <button onClick={() => res.setChecked([1, 3])}>setChecked([1, 3])</button>
      <button onClick={() => res.setChecked([2, 4, 5])}>
        setChecked([2, 4, 5])
      </button>
      <br />
      <br />
      <button onClick={() => res.setCheckBy(1, true)}>
        setCheckBy(1, true))
      </button>
      <button onClick={() => res.setCheckBy(3, false)}>
        setCheckBy(3, false)
      </button>
      <br />
      <br />
      <button onClick={() => res.checkList([1, 2, 3, 4])}>
        checkList([1, 2, 3, 4])
      </button>
      <button onClick={() => res.unCheckList([3, 4, 5, 6])}>
        unCheckList([3, 4, 5, 6])
      </button>
    </div>
  );
};

export default UseCheckDemo;
