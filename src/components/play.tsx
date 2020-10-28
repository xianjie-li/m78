import React from 'react';
import Dialog from 'm78/dialog';
import Modal from 'm78/modal';

const Play = () => {
  function model() {
    const [ref, id] = Modal.api({
      content: '这是弹窗内容',
    });

    console.log(ref, id);
  }

  return (
    <div>
      <button type="button" onClick={model}>
        按钮
      </button>
    </div>
  );
};

export default Play;
