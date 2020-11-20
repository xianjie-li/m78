import React from 'react';
import Drawer from 'm78/drawer';
import Button from 'm78/button';

const Demo = () => {
  return (
    <div>
      <div>
        <Drawer direction="left" style={{ width: '40%' }} triggerNode={<Button>left</Button>}>
          <div>这里是渲染的内容</div>
        </Drawer>
        <Drawer direction="top" style={{ height: '40%' }} triggerNode={<Button>top</Button>}>
          <div>这里是渲染的内容</div>
        </Drawer>
        <Drawer direction="right" style={{ width: '40%' }} triggerNode={<Button>right</Button>}>
          <div>这里是渲染的内容</div>
        </Drawer>
        <Drawer direction="bottom" style={{ height: '40%' }} triggerNode={<Button>bottom</Button>}>
          <div>这里是渲染的内容</div>
        </Drawer>
        <Drawer fullScreen direction="bottom" triggerNode={<Button>fullScreen</Button>}>
          <div>这里是渲染的内容</div>
        </Drawer>
        <Drawer direction="right" style={{ width: '40%' }} triggerNode={<Button>nest</Button>}>
          <div>
            这里是渲染的内容
            <Drawer
              direction="right"
              style={{ width: '40%' }}
              triggerNode={<Button>打开嵌套内容</Button>}
            >
              <div>
                这里是渲染的内容
                <Drawer
                  direction="right"
                  style={{ width: '40%' }}
                  triggerNode={<Button>打开嵌套内容</Button>}
                >
                  <div>
                    这里是渲染的内容
                    <Drawer
                      direction="right"
                      style={{ width: '40%' }}
                      triggerNode={<Button>打开嵌套内容</Button>}
                    >
                      <div>这里是渲染的内容</div>
                    </Drawer>
                  </div>
                </Drawer>
              </div>
            </Drawer>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default Demo;
