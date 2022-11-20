import React, { useState } from "react";
import { Spin } from "../../src/spin";
import { render } from "../utils";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Spin size="small" />
      <Spin />
      <Spin size="large" />
      <Spin size="big" />

      <Spin text="加载中" />
      <Spin text="加载中" inline />

      <div
        style={{
          width: 200,
          height: 200,
          position: "relative",
          border: "1px solid red",
          marginTop: 12,
        }}
      >
        <Spin text="加载中" full />
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet
        blanditiis consequatur ducimus, ea eos, et explicabo iure magni minima
        modi neque nobis pariatur perferendis sed, sequi sit suscipit tempore
        tenetur.
      </div>

      <div
        style={{
          width: 200,
          height: 200,
          position: "relative",
          border: "1px solid red",
          marginTop: 12,
        }}
      >
        <Spin text="加载中" full inline offset="20%" />
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet
        blanditiis consequatur ducimus, ea eos, et explicabo iure magni minima
        modi neque nobis pariatur perferendis sed, sequi sit suscipit tempore
        tenetur.
      </div>

      <button className="mt-12" onClick={() => setOpen((p) => !p)}>
        {open.toString()}
      </button>

      <div
        style={{
          width: 200,
          height: 200,
          position: "relative",
          border: "1px solid red",
          marginTop: 12,
        }}
      >
        <Spin text="加载中" full open={open} />
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet
        blanditiis consequatur ducimus, ea eos, et explicabo iure magni minima
        modi neque nobis pariatur perferendis sed, sequi sit suscipit tempore
        tenetur.
      </div>
    </div>
  );
}

render(<App />);
