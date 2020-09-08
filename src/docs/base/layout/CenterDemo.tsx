import React from 'react';
import { Center } from 'm78/layout';

const boxSty: React.CSSProperties = {
  borderRadius: 4,
  background: 'rgba(0, 0, 0, 0.1)',
  padding: 12,
  margin: 12,
};

const AspectRatioDemo = () => {
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
    </div>
  );
};

export default AspectRatioDemo;
