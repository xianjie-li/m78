import React from 'react';
import { Center, Column, Row, Divider, Flex } from 'm78/layout';

const boxSty: React.CSSProperties = {
  borderRadius: 4,
  background: 'rgba(0, 0, 0, 0.1)',
  padding: 12,
  margin: 12,
};

const Play = () => {
  return (
    <div>
      <Center style={{ ...boxSty, width: 200, height: 200 }}>居中文本</Center>

      <div className="color-second">附加到一个已有容器上，需要为容器设置position</div>
      <div style={{ ...boxSty, width: 200, height: 200, position: 'relative' }}>
        <Center attach>
          <Center style={{ width: 160, height: 160, backgroundColor: '#1890ff' }}>
            <Center style={{ width: 120, height: 120, backgroundColor: '#13c2c2' }}>
              <Center style={{ width: 80, height: 80, backgroundColor: '#f5222d' }} />
            </Center>
          </Center>
        </Center>
      </div>

      <div>
        Lorem ipsum <Divider vertical /> dolor sit amet, consectetur <Divider vertical />{' '}
        adipisicing elit. Ad aliquid aperiam aspernatur debitis eaque earum, est et impedit sint
        tempore. Alias at aut corporis eligendi enim, excepturi explicabo labore. Similique.
      </div>

      <Divider />

      <div>
        Lorem ipsum <Divider vertical /> dolor sit amet, consectetur <Divider vertical />{' '}
        adipisicing elit. Ad aliquid aperiam aspernatur debitis eaque earum, est et impedit sint
        tempore. Alias at aut corporis eligendi enim, excepturi explicabo labore. Similique.
      </div>

      <div>123213</div>

      <Divider />

      <div>
        呵呵
        <Divider vertical />
        过我个望各位各位
        <Divider vertical />
        房前屋后物权法完全服务器服务器服务器服务器去污粉请问服务器
      </div>

      <Column
        style={{ height: 300, border: '1px solid red' }}
        mainAlign="between"
        crossAlign="center"
      >
        <span>123</span>
        <span>123</span>
        <span>123</span>
        <span>123</span>
        <span>123</span>
      </Column>

      <Row style={{ height: 140, border: '1px solid red' }} mainAlign="between">
        <span>111</span>
        <Flex flex={1}>222</Flex>
        <span>333</span>
        <Flex order={-1}>444</Flex>
        <span>555</span>
      </Row>
    </div>
  );
};

export default Play;
