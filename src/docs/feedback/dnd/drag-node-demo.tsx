import React from 'react';
import DND, { DNDContext } from 'm78/dnd';
import { Row } from 'm78/layout';

const DragNodeDemo = () => {
  return (
    <div>
      <DNDContext>
        <Row>
          <DND
            data="DND1"
            dragFeedbackStyle={{
              borderRadius: '50%',
            }}
          >
            {({ innerRef }) => {
              return (
                <div
                  ref={innerRef}
                  style={{
                    width: 150,
                    height: 150,
                    border: '1px solid red',
                    padding: 12,
                    borderRadius: 2,
                  }}
                >
                  <span>添加额外样式</span>
                </div>
              );
            }}
          </DND>
          <DND data="DND2" dragFeedback={<span className="fs-38">😛</span>}>
            {({ innerRef }) => {
              return (
                <div
                  ref={innerRef}
                  style={{
                    width: 150,
                    height: 150,
                    border: '1px solid red',
                    padding: 12,
                    borderRadius: 2,
                    marginLeft: 12,
                  }}
                >
                  <span>替换拖动节点</span>
                </div>
              );
            }}
          </DND>
        </Row>
      </DNDContext>
    </div>
  );
};

export default DragNodeDemo;
