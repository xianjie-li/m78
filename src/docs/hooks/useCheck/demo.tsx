import React, {useCallback, useRef, useState} from 'react';
import { isArray } from '@lxjx/utils';

import { useCheck } from '@lxjx/fr/lib/hooks';

const options1 = [1, 2, 3, 4, 5];
const options2 = [
  { id: 1, label: '选项1' },
  { id: 2, label: '选项2' },
  { id: 3, label: '选项3' },
  { id: 4, label: '选项4', disabled: true },
  { id: 5, label: '选项5' },
];

const Demo = () => {
  // options2, [1, 3], item => item.id
  const res = useCheck<Number, { id: number, disabled?: boolean; }>({
    options: options2,
    defaultCheck: [1, 3, 4],
    disables: [4],
    collector: item => item.id,
  });

  return (
    <div>
      <div>
        {options2.map(item => (
          <label key={item.id}>
            <input
              type="checkbox"
              checked={res.isChecked(item.id)}
              onChange={({ target }) => res.setCheckBy(item.id, target.checked)}
              disabled={item.disabled}
            />
            {item.label}
          </label>
        ))}

      </div>

      <div>
        选中: {JSON.stringify(res.checked, null, 4)}
      </div>
      <div>
        原始选中: {JSON.stringify(res.originalChecked, null, 4)}
      </div>
      <div>
        是否全部选中: {res.allChecked.toString()}
      </div>
      <div>
        无任何值选中: {res.noneChecked.toString()}
      </div>
      <div>
        部分选中: {res.partialChecked.toString()}
      </div>
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
      <button onClick={() => res.checkAll()}>checkAll</button>
      <button onClick={() => res.unCheckAll()}>unCheckAll</button>
      <button onClick={() => res.toggleAll()}>toggleAll</button>
      <br />
      <br />
      <button onClick={() => console.log(res.isChecked(1))}>isChecked1</button>
      <button onClick={() => console.log(res.isChecked(2))}>isChecked2</button>
      <button onClick={() => console.log(res.isChecked(3))}>isChecked3</button>
      <button onClick={() => console.log(res.isChecked(4))}>isChecked4</button>
      <button onClick={() => console.log(res.isChecked(5))}>isChecked5</button>
      <br />
      <br />
      <button onClick={() => console.log(res.isDisabled(1))}>isDisabled1</button>
      <button onClick={() => console.log(res.isDisabled(2))}>isDisabled2</button>
      <button onClick={() => console.log(res.isDisabled(3))}>isDisabled3</button>
      <button onClick={() => console.log(res.isDisabled(4))}>isDisabled4</button>
      <button onClick={() => console.log(res.isDisabled(5))}>isDisabled5</button>
      <br />
      <br />
      <button onClick={() => res.setChecked([1, 3])}>setChecked([1, 3])</button>
      <button onClick={() => res.setChecked([2, 4, 5])}>setChecked([2, 4, 5])</button>
      <br />
      <br />
      <button onClick={() => res.setCheckBy(2, true)}>setCheckBy(2, true)</button>
      <button onClick={() => res.setCheckBy(4, false)}>setCheckBy(4, false)</button>
    </div>
  );
};

export default Demo;
