import renderer from "react-test-renderer";
import React from "react";
import { FullSize } from "../common";
import { Spin } from "./index";

test("spin base", () => {
  const r = renderer
    .create(
      <div>
        <Spin size={FullSize.small} />
        <Spin className="ml-12" />
        <Spin size={FullSize.large} className="ml-12" />
        <Spin size={FullSize.big} className="ml-12" />
        <Spin size={FullSize.small} text="加载中" />

        <div className="mt-12">
          <Spin size={FullSize.small} inline text="加载中" />
          <Spin
            size={FullSize.small}
            inline
            text="自定义文本"
            className="ml-12"
          />
        </div>

        <div className="d-spin-full-wrap">
          Lorem ipsum
          <Spin open full />
        </div>
      </div>
    )
    .toJSON();

  expect(r).toMatchSnapshot();
});
