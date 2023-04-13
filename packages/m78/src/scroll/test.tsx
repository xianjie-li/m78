import { render } from "@testing-library/react";
import React from "react";
import { Scroll } from "./index";

describe("Scroll", () => {
  test("base", () => {
    const r = render(
      <Scroll
        direction="xy"
        style={{ height: 300, width: 300, border: "1px solid red" }}
        dragScroll
        scrollIndicator={false}
      >
        <div
          style={{
            width: 600,
            height: 600,
          }}
        >
          lorem
        </div>
      </Scroll>
    );

    expect(r.container).toMatchSnapshot();
  });
});
