import React, { useEffect, useState } from 'react';
import { m78Config } from 'm78/config';

import './style.scss';
import { Input } from 'm78/input';
import { Row } from 'm78/layout';
import { array, required, string } from '@m78/verify';
import { createVForm } from '@m78/vform';
import { Button } from 'm78/button';

/** 创建一个form实例 */
const form = createVForm({
  defaultValue: {
    name: 'lxj',
    things: [
      {
        title: 'iphone4',
        desc: '小米牌的iphone4',
      },
      {
        title: 'nintendo switch',
        desc: '塞尔达启动器',
      },
    ],
  },
});

/** 创建一个field实例 */
const nameField = form.createField({
  name: 'name',
  validator: [required(), string({ min: 4, max: 8 })],
});

const thingList = form.createList({
  name: 'things',
  validator: [required(), array({ min: 3 })],
  // 控制如何生成list的子项
  onFillField: (list, key, index) => {
    list.add({
      fields: [
        form.createField({
          name: list.withName(index, 'title'),
          separate: true,
          validator: [required(), string({ min: 2, max: 8 })],
        }),
        form.createField({
          name: list.withName(index, 'desc'),
          separate: true,
          validator: [required(), string({ min: 2, max: 8 })],
        }),
      ],
      key,
    });
  },
});

// 上面为虚拟表单的创建代码, 下面做了一些简单的桥接来将虚拟表单绑定到视图中

const App = () => {
  const dark = m78Config.useState(state => state.darkMode);

  const [, update] = useState(0);
  const [valString, setValString] = useState('');

  useEffect(() => {
    // 表单状态变更时更新组件
    function updateHandle() {
      update(prev => prev + 1);
    }

    function submitHandle(values: any) {
      setValString(JSON.stringify(values, null, 4));
    }

    form.updateEvent.on(updateHandle);
    form.changeEvent.on(updateHandle);
    form.submitEvent.on(submitHandle);

    return () => {
      form.updateEvent.off(updateHandle);
      form.changeEvent.off(updateHandle);
      form.submitEvent.off(submitHandle);
    };
  }, []);

  return (
    <div className="m78 p-16">
      <button
        style={{ position: 'fixed', right: 12, top: 12 }}
        type="button"
        onClick={() => m78Config.set({ darkMode: !m78Config.get().darkMode })}
      >
        {dark ? 'dark' : 'light'}
      </button>

      <div style={{ width: 540 }}>
        <div>
          <div>姓名</div>
          <div className="mt-4">
            <Input
              value={nameField.value}
              onChange={v => (nameField.value = v)}
              placeholder="姓名"
            />
            <div className="color-red">{nameField.touched && nameField.error}</div>
          </div>
        </div>

        <div className="mt-16">
          <div>物品</div>
          <div className="mt-4">
            {thingList.list.map((item, index) => {
              const titleField = form.getField(thingList.withName(index, 'title'));
              const descField = form.getField(thingList.withName(index, 'desc'));

              if (!titleField || !descField) return null;

              const max = thingList.list.length - 1;
              const min = 0;
              const prev = index - 1 < min ? max - 1 : index - 1;
              const next = index + 1 > max ? min : index + 1;

              return (
                <div key={item.key} className="mb-8">
                  <Row>
                    <div>
                      <Input
                        value={titleField.value}
                        onChange={v => (titleField.value = v)}
                        placeholder="名称"
                      />
                      <div className="color-red">{titleField.touched && titleField.error}</div>
                    </div>

                    <div className="ml-12">
                      <Input
                        value={descField.value}
                        onChange={v => (descField.value = v)}
                        placeholder="描述"
                      />
                      <div className="color-red">{descField.touched && descField.error}</div>
                    </div>

                    <Button onClick={() => thingList.move(index, prev)} className="ml-8">
                      ↑
                    </Button>
                    <Button onClick={() => thingList.move(index, next)}>↓</Button>
                    <Button onClick={() => thingList.remove(index)}>X</Button>
                  </Row>
                </div>
              );
            })}

            <div className="mt-4">
              <Button onClick={() => thingList.add()}>新增物品</Button>
            </div>

            <div className="color-red">{thingList.touched && thingList.error}</div>
          </div>
        </div>

        <div className="mt-32">
          <Button onClick={form.submit}>提交</Button>
          <Button onClick={form.reset}>重置</Button>
        </div>

        {valString && (
          <div className="mt-32">
            提交值:
            <pre
              className="mt-4"
              style={{ background: 'rgba(0,0,0,0.05)', padding: 14, borderRadius: 6 }}
            >
              {valString}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

/*
 * 分割线
 * */

export default App;
