import React from "react";
import { Lay, LayStyle, Button, Cell, Cells, Size, Status } from "m78";

const LayExample = () => {
  return (
    <div>
      <div style={{ maxWidth: 440 }}>
        <div>
          <p className="fs-md">默认样式</p>
          <div>
            <Lay leading="🍊" title="橘子" />
            <Lay leading="🍉" title="西瓜" desc="夏天的水果" arrow />
            <Lay leading="🥝" title="猕猴桃" trailing="桃凉凉" arrow />
            <Lay leading="🍇" title="葡萄" trailing="没货了" disabled arrow />
            <Lay
              leading="🍋"
              title="柠檬"
              trailing={<input type="checkbox" />}
              desc="一年一度的“我吃柠檬”挑战又要开始啦~，请记住我们的活动代号“#WCNM#”"
              effect={false}
            />
          </div>

          <p className="fs-md mt-32">边框风格</p>

          <div>
            <Lay leading="🍊" title="橘子" itemStyle={LayStyle.border} />
            <Lay
              leading="🍉"
              title="西瓜"
              desc="夏天的水果"
              arrow
              itemStyle={LayStyle.border}
              effect={false}
              foot={
                <div className="tr">
                  <Button size={Size.small}>操作1</Button>
                  <Button size={Size.small}>操作2</Button>
                </div>
              }
            />
            <Lay
              leading="🥝"
              title="猕猴桃"
              trailing="桃凉凉"
              arrow
              itemStyle={LayStyle.border}
            />
            <Lay
              leading="🍇"
              title="葡萄"
              trailing="没货了"
              disabled
              arrow
              itemStyle={LayStyle.border}
            />
            <Lay
              leading="🍋"
              title="柠檬"
              trailing={<input type="checkbox" />}
              desc="一年一度的“我吃柠檬”挑战又要开始啦~，请记住我们的活动代号“#WCNM#”"
              effect={false}
              itemStyle={LayStyle.border}
            />
          </div>

          <p className="fs-md mt-32">背景色风格</p>

          <div>
            <Lay leading="🍊" title="橘子" itemStyle={LayStyle.background} />
            <Lay
              leading="🍉"
              title="西瓜"
              desc="夏天的水果"
              arrow
              itemStyle={LayStyle.background}
            />
            <Lay
              leading="🥝"
              title="猕猴桃"
              trailing="桃凉凉"
              arrow
              itemStyle={LayStyle.background}
            />
            <Lay
              leading="🍇"
              title="葡萄"
              trailing="没货了"
              disabled
              arrow
              itemStyle={LayStyle.background}
            />
            <Lay
              leading="🍋"
              title="柠檬"
              trailing={<input type="checkbox" />}
              desc="一年一度的“我吃柠檬”挑战又要开始啦~，请记住我们的活动代号“#WCNM#”"
              effect={false}
              itemStyle={LayStyle.background}
            />
          </div>

          <p className="fs-md mt-32">尺寸 - 小</p>

          <div>
            <Lay
              leading="🍊"
              title="橘子"
              itemStyle={LayStyle.border}
              size={Size.small}
            />
            <Lay
              leading="🍉"
              title="西瓜"
              desc="夏天的水果"
              arrow
              itemStyle={LayStyle.border}
              size={Size.small}
            />
            <Lay
              leading="🥝"
              title="猕猴桃"
              trailing="桃凉凉"
              arrow
              itemStyle={LayStyle.border}
              size={Size.small}
            />
            <Lay
              leading="🍇"
              title="葡萄"
              trailing="没货了"
              disabled
              arrow
              itemStyle={LayStyle.border}
              size={Size.small}
            />
            <Lay
              leading="🍋"
              title="柠檬"
              trailing={<input type="checkbox" />}
              desc="一年一度的“我吃柠檬”挑战又要开始啦~，请记住我们的活动代号“#WCNM#”"
              effect={false}
              itemStyle={LayStyle.border}
              size={Size.small}
            />
          </div>

          <p className="fs-md mt-32">尺寸 - 大</p>

          <div>
            <Lay
              leading="🍊"
              title="橘子"
              itemStyle={LayStyle.border}
              size={Size.large}
            />
            <Lay
              leading="🍉"
              title="西瓜"
              desc="夏天的水果"
              arrow
              itemStyle={LayStyle.border}
              size={Size.large}
            />
            <Lay
              leading="🥝"
              title="猕猴桃"
              trailing="桃凉凉"
              arrow
              itemStyle={LayStyle.border}
              size={Size.large}
            />
            <Lay
              leading="🍇"
              title="葡萄"
              trailing="没货了"
              disabled
              arrow
              itemStyle={LayStyle.border}
              size={Size.large}
            />
            <Lay
              leading="🍋"
              title="柠檬"
              trailing={<input type="checkbox" />}
              desc="一年一度的“我吃柠檬”挑战又要开始啦~，请记住我们的活动代号“#WCNM#”"
              effect={false}
              itemStyle={LayStyle.border}
              size={Size.large}
            />
          </div>

          <p className="fs-md mt-32">状态</p>

          <div>
            <Lay leading="🍊" title="橘子" itemStyle={LayStyle.border} />
            <Lay
              leading="🍌"
              title="香蕉"
              arrow
              itemStyle={LayStyle.border}
              highlight
            />
            <Lay
              leading="🍉"
              title="西瓜"
              desc="夏天的水果"
              arrow
              itemStyle={LayStyle.border}
              active
            />
            <Lay
              leading="🥝"
              title="猕猴桃"
              trailing="桃凉凉"
              arrow
              itemStyle={LayStyle.border}
              status={Status.info}
            />
            <Lay
              leading="🍇"
              title="葡萄"
              trailing="没货了"
              arrow
              itemStyle={LayStyle.border}
              status={Status.success}
            />
            <Lay
              leading="🍋"
              title="柠檬"
              trailing={<input type="checkbox" />}
              desc="一年一度的“我吃柠檬”挑战又要开始啦~，请记住我们的活动代号“#WCNM#”"
              effect={false}
              itemStyle={LayStyle.border}
              status={Status.error}
            />
            <Lay
              leading="🍓"
              title="草莓"
              itemStyle={LayStyle.border}
              status={Status.warning}
            />
          </div>
        </div>
      </div>

      <p className="fs-md mt-32">多列</p>

      <Cells gutter={6}>
        <Cell col={4}>
          <Lay itemStyle={LayStyle.border} leading="🍊" title="橘子" arrow />
        </Cell>
        <Cell col={4}>
          <Lay itemStyle={LayStyle.border} leading="🍌" title="香蕉" arrow />
        </Cell>
        <Cell col={4}>
          <Lay itemStyle={LayStyle.border} leading="🍏" title="苹果" arrow />
        </Cell>
        <Cell col={4}>
          <Lay itemStyle={LayStyle.border} leading="🍍" title="菠萝" arrow />
        </Cell>
        <Cell col={4}>
          <Lay itemStyle={LayStyle.border} leading="🍒" title="樱桃" arrow />
        </Cell>
      </Cells>
    </div>
  );
};

export default LayExample;
