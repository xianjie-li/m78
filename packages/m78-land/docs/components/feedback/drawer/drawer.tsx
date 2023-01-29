import React from "react";
import { Lay } from "m78/lay/index.js";
import { Drawer } from "m78/drawer/index.js";
import { Button } from "m78/button/index.js";
import { Position, Size } from "m78/common/index.js";

const DrawerExample = () => {
  return (
    <div>
      <Drawer
        style={{
          width: 600,
        }}
        header="标题"
        footer={<Button size={Size.large}>确定</Button>}
        content={
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
        }
      >
        <Button>bottom</Button>
      </Drawer>
      <Drawer
        position={Position.right}
        style={{
          width: 400,
        }}
        header="标题"
        content={
          <div>
            <Lay leading="🍊" title="橘子" />
            <Lay leading="🍉" title="西瓜" desc="夏天的水果" arrow />
            <Lay leading="🥝" title="猕猴桃" trailing="桃凉凉" />
            <Lay leading="🍇" title="葡萄" trailing="没货了" disabled arrow />
            <Lay
              leading="🍋"
              title="柠檬"
              trailing={<input type="checkbox" />}
              desc="一年一度的“我吃柠檬”挑战又要开始啦~，请记住我们的活动代号“#WCNM#”"
              effect={false}
            />
            <Lay leading="🌽" title="蔬菜" />

            <Lay leading="🥦" title="蔬菜" />

            <Lay leading="🥬" title="蔬菜" />

            <Lay leading="🌶️" title="蔬菜" />
          </div>
        }
      >
        <Button>right</Button>
      </Drawer>

      <Drawer
        position={Position.top}
        style={{
          width: 600,
        }}
        header="标题"
        content={
          <div>
            <Lay leading="🍊" title="橘子" />
            <Lay leading="🍉" title="西瓜" desc="夏天的水果" arrow />
            <Lay leading="🥝" title="猕猴桃" trailing="桃凉凉" />
            <Lay leading="🍇" title="葡萄" trailing="没货了" disabled arrow />
            <Lay
              leading="🍋"
              title="柠檬"
              trailing={<input type="checkbox" />}
              desc="一年一度的“我吃柠檬”挑战又要开始啦~，请记住我们的活动代号“#WCNM#”"
              effect={false}
            />
            <Lay leading="🌽" title="蔬菜" />

            <Lay leading="🥦" title="蔬菜" />

            <Lay leading="🥬" title="蔬菜" />

            <Lay leading="🌶️" title="蔬菜" />
          </div>
        }
      >
        <Button>top</Button>
      </Drawer>

      <Drawer
        position={Position.left}
        style={{
          width: 600,
        }}
        header="标题"
        content={
          <div>
            <Lay leading="🍊" title="橘子" />
            <Lay leading="🍉" title="西瓜" desc="夏天的水果" arrow />
            <Lay leading="🥝" title="猕猴桃" trailing="桃凉凉" />
            <Lay leading="🍇" title="葡萄" trailing="没货了" disabled arrow />
            <Lay
              leading="🍋"
              title="柠檬"
              trailing={<input type="checkbox" />}
              desc="一年一度的“我吃柠檬”挑战又要开始啦~，请记住我们的活动代号“#WCNM#”"
              effect={false}
            />
            <Lay leading="🌽" title="蔬菜" />

            <Lay leading="🥦" title="蔬菜" />

            <Lay leading="🥬" title="蔬菜" />

            <Lay leading="🌶️" title="蔬菜" />
          </div>
        }
      >
        <Button>left</Button>
      </Drawer>

      <Button
        onClick={() => {
          Drawer.render({
            content: (
              <div>
                <Lay leading="🍊" title="橘子" />
                <Lay leading="🍉" title="西瓜" desc="夏天的水果" arrow />
                <Lay leading="🥝" title="猕猴桃" trailing="桃凉凉" arrow />
                <Lay
                  leading="🍇"
                  title="葡萄"
                  trailing="没货了"
                  disabled
                  arrow
                />
                <Lay
                  leading="🍋"
                  title="柠檬"
                  trailing={<input type="checkbox" />}
                  desc="一年一度的“我吃柠檬”挑战又要开始啦~，请记住我们的活动代号“#WCNM#”"
                  effect={false}
                />
              </div>
            ),
          });
        }}
      >
        通过api使用
      </Button>
    </div>
  );
};

export default DrawerExample;
