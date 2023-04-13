import React from "react";
import { Column, Flex, Row } from "m78";
import css from "./style.module.scss";

const FlexDemo = () => {
  return (
    <div>
      <h3>Row</h3>

      <div className="color-second">主轴为横向的Flex容器</div>

      <Row
        className="border"
        style={{ height: 100 }}
        mainAlign="around"
        crossAlign="center"
      >
        <div className={css.box} />
        <div className={css.box} />
        <div className={css.box} />
        <div className={css.box} />
        <div className={css.box} />
      </Row>

      <Row
        style={{ height: 100 }}
        mainAlign="between"
        crossAlign="center"
        className="mt-12 border"
      >
        <div className={css.box} />
        <div className={css.box} />
        <div className={css.box} />
        <div className={css.box} />
        <div className={css.box} />
      </Row>

      <Row
        style={{ height: 100 }}
        mainAlign="evenly"
        crossAlign="center"
        className="mt-12 border"
      >
        <div className={css.box} />
        <div className={css.box} />
        <div className={css.box} />
        <div className={css.box} />
        <div className={css.box} />
      </Row>

      <Row
        style={{ height: 100 }}
        mainAlign="start"
        crossAlign="center"
        className="mt-12 border"
      >
        <div className={css.box} />
        <div className={css.box} />
        <div className={css.box} />
        <div className={css.box} />
        <div className={css.box} />
      </Row>

      <Row
        style={{ height: 100 }}
        mainAlign="end"
        crossAlign="center"
        className="mt-12 border"
      >
        <div className={css.box} />
        <div className={css.box} />
        <div className={css.box} />
        <div className={css.box} />
        <div className={css.box} />
      </Row>

      <h3 className="mt-32">Column</h3>

      <div className="color-second">用法参数与Row一样，只是主轴方向不同</div>

      <Column mainAlign="around" crossAlign="center" className="border">
        <div className={css.box} />
        <div className={css.box} />
        <div className={css.box} />
      </Column>

      <h3 className="mt-32">Flex</h3>

      <div className="color-second">
        Flex子项，可以通过设置flex系数来控制扩展和收缩比例、设置order排序、单独设置对齐方式等
      </div>

      <Row
        style={{ height: 100 }}
        mainAlign="around"
        crossAlign="center"
        className="border"
      >
        <div className={css.box} />
        <div className={css.box} />
        <Flex className={css.box} />
        <Flex flex={2} className={css.box} />
        <div className={css.box} />
        <div className={css.box} />
      </Row>

      <div className="color-second mt-32">
        可以单独为每一项设置交叉轴上的对齐方式
      </div>

      <Row
        style={{ height: 160 }}
        mainAlign="around"
        crossAlign="center"
        className="border"
      >
        <Flex className={css.box} align="start" />
        <Flex flex={2} className="d-layout-box" align="center" />
        <Flex className={css.box} align="end" />
      </Row>
    </div>
  );
};

export default FlexDemo;
