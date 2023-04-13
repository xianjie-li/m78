import React from "react";
import { Divider } from "m78";

const AspectRatioDemo = () => {
  return (
    <div>
      <Divider />
      <Divider>分割线</Divider>
      <Divider align="start">分割线</Divider>
      <Divider align="end">分割线</Divider>
      <Divider style={{ height: 300 }} vertical>
        分割线
      </Divider>
      <Divider style={{ height: 300 }} vertical align="start">
        分割线
      </Divider>
      <Divider style={{ height: 300 }} vertical align="end">
        分割线
      </Divider>
      <Divider>纵向分割 / 尺寸</Divider>
      内联的 <Divider vertical /> 分割线, 可以设置不同的尺寸
      <Divider color="red" vertical />
      <Divider color="orange" size={2} vertical />
      <Divider color="yellow" size={3} vertical />
      <Divider color="green" size={4} vertical />
      <Divider color="cyan" size={5} vertical />
      <Divider color="blue" size={6} vertical />
      <Divider color="purple" size={7} vertical />
      <Divider color="orange" size={2} />
      <Divider color="cyan" size={5} />
      <Divider color="purple" size={7} />
    </div>
  );
};

export default AspectRatioDemo;
