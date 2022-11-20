import React from "react";
import { Spin } from "m78/spin";

const IconDemo = () => {
  const [open, setOpen] = React.useState(true);

  return (
    <div>
      <div
        className="d-spin-full-wrap"
        onClick={() => setOpen((prev) => !prev)}
      >
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur
        cupiditate harum odit officia quas soluta velit voluptatibus. Aut iusto
        molestias nulla odit optio provident, quasi quisquam rem sit, vero
        voluptas.
        <Spin open={open} full />
      </div>
    </div>
  );
};

export default IconDemo;
