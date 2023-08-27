import React from "react";
import { Lay, LayStyle } from "../../src/lay/index.js";
import { Button, ButtonColor, Size, Status } from "../../src/index.js";
import { Cell, Cells } from "../../src/layout/index.js";
import { IconInfo } from "@m78/icons/icon-info.js";
import { IconWarning } from "@m78/icons/icon-warning.js";
import { IconError } from "@m78/icons/icon-error.js";
import { IconPlaylistAddCheckCircle } from "@m78/icons/icon-playlist-add-check-circle.js";

const LayExample = () => {
  return (
    <div>
      <div style={{ maxWidth: 400 }}>
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
            <Lay
              leading="🍉"
              title="active状态"
              desc="高亮显示的项"
              arrow
              active
            />
            <Lay
              leading={<IconInfo className="color-blue" />}
              title="提示"
              desc="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Alias atque beatae ducimus."
              effect={false}
              crossAlign="start"
              status={Status.info}
            />
            <Lay
              leading={<IconPlaylistAddCheckCircle className="color-success" />}
              title="成功"
              desc="Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Alias atque beatae ducimus."
              effect={false}
              crossAlign="start"
              status={Status.success}
            />
            <Lay
              leading={<IconWarning className="color-warning" />}
              title="警告"
              effect={false}
              crossAlign="start"
              status={Status.warning}
            />
            <Lay
              leading={<IconError className="color-error" />}
              title="失败"
              desc="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
              effect={false}
              crossAlign="start"
              itemStyle={LayStyle.border}
              status={Status.error}
              foot={
                <div className="tr">
                  <Button size={Size.small}>操作1</Button>
                  <Button size={Size.small} color={ButtonColor.red}>
                    操作2
                  </Button>
                </div>
              }
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
