import { render } from "@testing-library/react";
import React from "react";
import { Result } from "./index.js";
import { Size } from "../common/index.js";

describe("result", function () {
  test("should render with props", function () {
    const c = render(
      <Result title="title" className="extra-cls" style={{ color: "red" }} />
    );

    expect(c.container).toMatchSnapshot();

    c.rerender(<Result title="title" desc="desc" />);

    expect(c.container).toMatchSnapshot();

    c.rerender(<Result title="title" desc="desc" extra="extra" />);

    expect(c.container).toMatchSnapshot();

    c.rerender(
      <Result title="title" desc="desc" extra="extra" actions="actions" />
    );

    expect(c.container).toMatchSnapshot();

    c.rerender(
      <Result
        title="title"
        desc="desc"
        extra="extra"
        actions="actions"
        icon="icon"
      />
    );

    expect(c.container).toMatchSnapshot();

    c.rerender(
      <Result
        title="title"
        desc="desc"
        extra="extra"
        actions="actions"
        icon="icon"
        size={Size.small}
      />
    );

    expect(c.container).toMatchSnapshot();

    c.rerender(
      <Result
        title="title"
        desc="desc"
        extra="extra"
        actions="actions"
        icon="icon"
        size={Size.large}
      />
    );

    expect(c.container).toMatchSnapshot();
  });
});
