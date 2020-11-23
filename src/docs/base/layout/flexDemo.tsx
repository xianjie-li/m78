import React from 'react';
import { Column, Flex, Row } from 'm78/layout';

const boxSty: React.CSSProperties = {
  borderRadius: 4,
  background: 'rgba(0, 0, 0, 0.1)',
  padding: 12,
  width: 60,
  height: 60,
  margin: 12,
};

const FlexDemo = () => {
  return (
    <div>
      <h3>Row</h3>

      <div className="color-second">主轴为横向的Flex容器</div>

      <Row
        style={{ height: 100, border: '1px solid rgba(0,0,0,0.15)' }}
        mainAlign="around"
        crossAlign="center"
      >
        <div style={boxSty} />
        <div style={boxSty} />
        <div style={boxSty} />
        <div style={boxSty} />
        <div style={boxSty} />
      </Row>

      <Row
        style={{ height: 100, border: '1px solid rgba(0,0,0,0.15)' }}
        mainAlign="between"
        crossAlign="center"
        className="mt-12"
      >
        <div style={boxSty} />
        <div style={boxSty} />
        <div style={boxSty} />
        <div style={boxSty} />
        <div style={boxSty} />
      </Row>

      <Row
        style={{ height: 100, border: '1px solid rgba(0,0,0,0.15)' }}
        mainAlign="evenly"
        crossAlign="center"
        className="mt-12"
      >
        <div style={boxSty} />
        <div style={boxSty} />
        <div style={boxSty} />
        <div style={boxSty} />
        <div style={boxSty} />
      </Row>

      <Row
        style={{ height: 100, border: '1px solid rgba(0,0,0,0.15)' }}
        mainAlign="start"
        crossAlign="center"
        className="mt-12"
      >
        <div style={boxSty} />
        <div style={boxSty} />
        <div style={boxSty} />
        <div style={boxSty} />
        <div style={boxSty} />
      </Row>

      <Row
        style={{ height: 100, border: '1px solid rgba(0,0,0,0.15)' }}
        mainAlign="end"
        crossAlign="center"
        className="mt-12"
      >
        <div style={boxSty} />
        <div style={boxSty} />
        <div style={boxSty} />
        <div style={boxSty} />
        <div style={boxSty} />
      </Row>

      <h3 className="mt-32">Column</h3>

      <div className="color-second">用法参数与Row一样，只是主轴方向不同</div>

      <Column
        style={{ border: '1px solid rgba(0,0,0,0.15)' }}
        mainAlign="around"
        crossAlign="center"
      >
        <div style={boxSty} />
        <div style={boxSty} />
        <div style={boxSty} />
      </Column>

      <h3 className="mt-32">Flex</h3>

      <div className="color-second">
        Flex子项，可以通过设置flex系数来控制扩展和收缩比例、设置order排序、单独设置对齐方式等
      </div>

      <Row
        style={{ height: 100, border: '1px solid rgba(0,0,0,0.15)' }}
        mainAlign="around"
        crossAlign="center"
      >
        <div style={boxSty} />
        <div style={boxSty} />
        <Flex style={boxSty} />
        <Flex flex={2} style={boxSty} />
        <div style={boxSty} />
        <div style={boxSty} />
      </Row>

      <div className="color-second mt-32">可以单独为每一项设置交叉轴上的对齐方式</div>

      <Row
        style={{ height: 160, border: '1px solid rgba(0,0,0,0.15)' }}
        mainAlign="around"
        crossAlign="center"
      >
        <Flex style={boxSty} align="start" />
        <Flex flex={2} style={boxSty} align="center" />
        <Flex style={boxSty} align="end" />
      </Row>
    </div>
  );
};

export default FlexDemo;
