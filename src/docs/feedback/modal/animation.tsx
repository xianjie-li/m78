import React from 'react';

import Modal from 'm78/modal';
import sty from './style.module.scss';

const Alignment = () => {
  return (
    <div>
      <Modal triggerNode={<button type="button">fromMouse</button>}>
        <div className={sty.box}>
          我是弹层内容
          <div>
            <Modal animationType="fade" triggerNode={<button type="button">fade</button>}>
              <div className={sty.box}>
                我是弹层内容
                <div>
                  <Modal animationType="zoom" triggerNode={<button type="button">zoom</button>}>
                    <div className={sty.box}>
                      我是弹层内容
                      <Modal
                        animationType="punch"
                        triggerNode={<button type="button">punch</button>}
                      >
                        <div className={sty.box}>
                          我是弹层内容
                          <div>
                            <Modal
                              animationType="slideLeft"
                              triggerNode={<button type="button">slideLeft</button>}
                            >
                              <div className={sty.box}>
                                我是弹层内容
                                <div>
                                  <Modal
                                    animationType="slideRight"
                                    triggerNode={<button type="button">slideRight</button>}
                                  >
                                    <div className={sty.box}>
                                      我是弹层内容
                                      <div>
                                        <Modal
                                          animationType="slideTop"
                                          triggerNode={<button type="button">slideTop</button>}
                                        >
                                          <div className={sty.box}>
                                            <div>
                                              我是弹层内容
                                              <Modal
                                                animationType="slideBottom"
                                                triggerNode={
                                                  <button type="button">slideBottom</button>
                                                }
                                              >
                                                <div className={sty.box}>
                                                  我是弹层内容
                                                  <div>
                                                    <Modal
                                                      animationType="bounce"
                                                      triggerNode={
                                                        <button type="button">bounce</button>
                                                      }
                                                    >
                                                      <div className={sty.box}>我是弹层内容</div>
                                                    </Modal>
                                                  </div>
                                                </div>
                                              </Modal>
                                            </div>
                                          </div>
                                        </Modal>
                                      </div>
                                    </div>
                                  </Modal>
                                </div>
                              </div>
                            </Modal>
                          </div>
                        </div>
                      </Modal>
                    </div>
                  </Modal>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Alignment;
