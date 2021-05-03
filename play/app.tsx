import React, { useEffect, useRef, useState } from 'react';
// import { Button } from 'm78/button';
import { m78Config } from 'm78/config';
import { Divider, Row, Spacer } from 'm78/layout';
import { Select, SelectOptionItem } from 'm78/select';
import { ListView, ListViewItem, ListViewTitle } from 'm78/list-view';
import { Check } from 'm78/check';
import { ListViewItemStyleEnum } from 'm78/list-view/types';
import { SizeEnum } from 'm78/types';
import { Button } from 'm78/button';
import { Input } from 'm78/input';
import { Form } from 'm78/form';

import './style.scss';
import { FormItemLayout, FormLayout } from 'm78/form/layout';

const itemStyleDs: SelectOptionItem[] = [
  {
    label: '分割线',
    value: ListViewItemStyleEnum.splitLine,
  },
  {
    label: '边框',
    value: ListViewItemStyleEnum.border,
  },
  {
    label: '无',
    value: 'none',
  },
];

const sizeDs: SelectOptionItem[] = [
  {
    label: '大',
    value: SizeEnum.large,
  },
  {
    label: '常规',
    value: '',
  },
  {
    label: '小',
    value: SizeEnum.small,
  },
];

const App = () => {
  const dark = m78Config.useState(state => state.darkMode);

  const [column, setColumn] = useState(0);
  const [border, setBorder] = useState(true);
  const [itemStyle, setItemStyle] = useState(ListViewItemStyleEnum.splitLine);
  const [size, setSize] = useState<undefined | string>();
  const [effect, setEffect] = useState(true);

  return (
    <div className="p-32">
      <Button onClick={() => m78Config.setState({ darkMode: !m78Config.getState().darkMode })}>
        {dark ? 'dark' : 'light'}
      </Button>

      <Divider />

      <Form />

      <div className="mb-24">
        <Button onClick={() => setBorder(prev => !prev)}>边框 ({border ? '开' : '关'})</Button>
        <Button onClick={() => setColumn(prev => (prev ? 0 : 3))}>
          多列 ({column === 3 ? '开' : '关'})
        </Button>
        <Button onClick={() => setEffect(prev => !prev)}>交互效果 ({effect ? '开' : '关'})</Button>

        <Spacer />

        <Select
          size="small"
          value={itemStyle}
          onChange={setItemStyle}
          options={itemStyleDs}
          placeholder="项风格"
          style={{ width: 100 }}
        />

        <Spacer width={8} />

        <Select
          size="small"
          value={size}
          onChange={setSize}
          options={sizeDs}
          placeholder="尺寸"
          style={{ width: 100 }}
        />
      </div>

      <FormLayout border={border} column={column} itemStyle={itemStyle} size={size as SizeEnum}>
        <FormItemLayout label="姓名">
          <Input placeholder="请输入" />
        </FormItemLayout>
        <FormItemLayout label="年龄">
          <Input placeholder="请输入" />
        </FormItemLayout>
        <FormItemLayout label="爱好">
          <Input placeholder="请输入" />
        </FormItemLayout>
        <FormItemLayout label="性别">
          <Input placeholder="请输入" />
        </FormItemLayout>
      </FormLayout>

      <ListView
        effect={false}
        border={border}
        column={column}
        itemStyle={itemStyle}
        size={size as SizeEnum}
        className="m78-form __horizontal"
      >
        <ListViewTitle>收藏的水果</ListViewTitle>

        <ListViewItem
          className="m78-form_item"
          titleEllipsis={0}
          title={
            <div className="m78-form_item-main">
              <div className="m78-form_item-label">用户名哈哈</div>
              <div className="m78-form_item-cont">
                <Input placeholder="请输入用户名" />
                <div className="m78-form_item-text-wrap">
                  <div className="m78-form_item-text">描述文本描述文本描述文本</div>
                  <div className="m78-form_item-tips-text">错误文本错误文本错误文本</div>
                </div>
              </div>
            </div>
          }
        />

        <ListViewItem
          className="m78-form_item"
          titleEllipsis={0}
          title={
            <div className="m78-form_item-main">
              {/*<div className="m78-form_item-label">用户名</div>*/}
              <div className="m78-form_item-cont">
                <div className="m78-form_item-unit-wrap">
                  <ListViewItem
                    className="m78-form_item"
                    titleEllipsis={0}
                    title={
                      <div className="m78-form_item-main">
                        <div className="m78-form_item-label">用户名</div>
                        <div className="m78-form_item-cont">
                          <div className="m78-form_item-unit-wrap">
                            <Input placeholder="请输入用户名" />
                          </div>
                          <div className="m78-form_item-text-wrap">
                            <div className="m78-form_item-text">描述文本描述文本描述文本</div>
                            <div className="m78-form_item-tips-text">错误文本错误文本错误文本</div>
                          </div>
                        </div>
                      </div>
                    }
                  />

                  <ListViewItem
                    className="m78-form_item"
                    titleEllipsis={0}
                    title={
                      <div className="m78-form_item-main">
                        <div className="m78-form_item-label">
                          用户名
                          <i className="m78-form_require-mark" title="必填项">
                            *
                          </i>
                        </div>
                        <div className="m78-form_item-cont">
                          <div className="m78-form_item-unit-wrap">
                            <Input placeholder="请输入用户名" />
                          </div>
                          <div className="m78-form_item-text-wrap">
                            <div className="m78-form_item-text">描述文本描述文本描述文本</div>
                            <div className="m78-form_item-tips-text">错误文本错误文本错误文本</div>
                          </div>
                        </div>
                      </div>
                    }
                  />
                </div>
                {/*<div className="m78-form_item-text-wrap">*/}
                {/*  <div className="m78-form_item-text">描述文本描述文本描述文本</div>*/}
                {/*  <div className="m78-form_item-tips-text">错误文本错误文本错误文本</div>*/}
                {/*</div>*/}
              </div>
            </div>
          }
        />

        <ListViewItem
          className="m78-form_item"
          titleEllipsis={0}
          title={
            <div className="m78-form_item-main">
              <div className="m78-form_item-label">用户名</div>
              <div className="m78-form_item-cont">
                <Input placeholder="请输入用户名" />
                <div className="m78-form_item-text">错误文本</div>
              </div>
            </div>
          }
        />

        <ListViewItem leading="🍉" title="西瓜" arrow />

        <ListViewItem leading="🥝" title="猕猴桃" arrow desc="水果之王" />
        <ListViewItem leading="🍇" title="葡萄" trailing={<Check type="switch" />} />
        <ListViewItem leading="🍓" title="草莓" arrow trailing="其实不是水果" />
        <ListViewItem
          leading="🍒"
          title={
            <span>
              樱<span className="color-red">桃</span>
            </span>
          }
          arrow
        />

        <ListViewTitle subTile>偶尔吃</ListViewTitle>

        <ListViewItem
          leading="🍋"
          title="柠檬"
          arrow
          desc="一年一度的“我吃柠檬”挑战又要开始啦~，请记住我们的活动代号“#WCNM#”"
        />
        <ListViewItem leading="🍍" title="菠萝" arrow trailing="也叫凤梨" />
        <ListViewItem leading="🍎" title="苹果" arrow />
      </ListView>
    </div>
  );
};

/*
 * 分割线
 * */

export default App;
