import React, { SyntheticEvent, useMemo, useRef, useState } from 'react';
import { m78Config } from 'm78/config';

import './style.scss';
import { Button } from 'm78/button';
import { useForm } from 'm78/form';
import { SizeEnum } from 'm78/common';
import { Bubble, BubbleTypeEnum } from 'm78/bubble';
import { Overlay, OverlayInstance } from 'm78/overlay';

const App = () => {
  const dark = m78Config.useState(state => state.darkMode);

  const [show, setShow] = useState(false);

  const [mount, setMount] = useState(false);

  const insRef = useRef<OverlayInstance>(null!);

  function handleClick(e: SyntheticEvent) {
    insRef.current.updateTarget(e.currentTarget as HTMLElement);
    setShow(true);
  }

  return (
    <div className="m78 p-16">
      <button
        style={{ position: 'fixed', right: 12, top: 12 }}
        type="button"
        onClick={() => m78Config.set({ darkMode: !m78Config.get().darkMode })}
      >
        {dark ? 'dark' : 'light'}
      </button>

      <Bubble content="简单的文本提示, 也可以是任意ReactNode">
        <Button>tooltip</Button>
      </Bubble>

      {mount && (
        <>
          <Bubble
            title="Popper提示"
            type={BubbleTypeEnum.popper}
            content={
              <div>
                <div>气泡提示内容</div>
                <div>适合放置一些相对复杂的内容</div>
              </div>
            }
          >
            <Button>popper</Button>
          </Bubble>

          <Bubble
            type={BubbleTypeEnum.confirm}
            content="此操作不可撤, 是否确认?"
            onConfirm={() => {
              console.log('确认操作');
            }}
          >
            <Button>confirm</Button>
          </Bubble>
        </>
      )}

      <Bubble
        instanceRef={insRef}
        show={show}
        onChange={setShow}
        content={<div>我是气泡内容~~</div>}
      />

      <Button onClick={handleClick}>按钮1</Button>
      <Button onClick={handleClick}>按钮2</Button>
      <Button onClick={handleClick}>按钮3</Button>
      <Button onClick={handleClick}>按钮4</Button>
      <Button onClick={handleClick}>按钮5</Button>

      <Button onClick={() => setMount(prev => !prev)}>setMount</Button>

      <Overlay
        content={meta => (
          <div>
            你好 <Button onClick={() => meta.setShow(false)}>close</Button>
          </div>
        )}
      >
        <Button>click</Button>
      </Overlay>
    </div>
  );
};

/*
 * 分割线
 * */

export default App;
