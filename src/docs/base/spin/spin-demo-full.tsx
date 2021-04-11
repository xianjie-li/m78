import React from 'react';
import Spin from 'm78/spin';
import 'm78/spin/style';

const IconDemo = () => {
  const [show, setShow] = React.useState(true);

  return (
    <div>
      <div className="d-spin-full-wrap" onClick={() => setShow(prev => !prev)}>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur cupiditate harum odit
        officia quas soluta velit voluptatibus. Aut iusto molestias nulla odit optio provident,
        quasi quisquam rem sit, vero voluptas.
        <Spin show={show} full />
      </div>
    </div>
  );
};

export default IconDemo;
