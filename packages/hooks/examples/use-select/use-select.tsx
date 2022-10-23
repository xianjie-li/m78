import React from "react";
import { useSelect } from "../../src";

const list = [1, 2, 3, 4, 5, 6];

const UseSelect = () => {
  const select = useSelect({
    list: list,
  });

  console.log(select);

  return (
    <div>
      <button onClick={() => select.toggle(3)}>toggle(3)</button>
      <button onClick={() => select.toggleAll()}>toggleAll(3)</button>

      <div>{select.state.selected}</div>
    </div>
  );
};

export default UseSelect;
