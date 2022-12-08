import React from "react";
import {
  Trigger,
  useFn,
  useSetState,
  useTrigger,
  UseTriggerEvent,
  UseTriggerType,
} from "../../src/index.js";

const UseTriggerExample = () => {
  const [state, setState] = useSetState({
    focus: false,
    active: false,
    text: [] as string[],
  });

  const evHandle = useFn((e: UseTriggerEvent) => {
    if (e.type === UseTriggerType.focus) {
      setState({
        focus: e.focus,
        text: [...state.text, e.focus ? "focus" : "blur"],
      });
    }
    if (e.type === UseTriggerType.active) {
      setState({
        active: e.active,
        text: [...state.text, e.active ? "active" : "inactive"],
      });
    }
    if (e.type == UseTriggerType.click) {
      setState({
        text: [...state.text, "click"],
      });
    }
    console.log(e);
  });

  const btn1 = useTrigger({
    element: (
      <button
        style={{
          transform: state.active ? "scale(1.2)" : undefined,
          outline: state.focus ? "2px solid red" : undefined,
        }}
      >
        click & focus & active
      </button>
    ),
    type: [UseTriggerType.click, UseTriggerType.focus, UseTriggerType.active],
    onTrigger: evHandle,
  });

  const btn2 = useTrigger({
    element: <button>contextMenu</button>,
    type: UseTriggerType.contextMenu,
    onTrigger(e) {
      setState({
        text: [...state.text, "contextMenu"],
      });
      console.log(e);
    },
  });

  return (
    <div>
      <div>
        {btn1} {btn2}
      </div>
      <div style={{ width: 500, wordBreak: "break-word" }}>
        {state.text.map((i, ind) => (
          <span key={ind} style={{ marginLeft: 12 }}>
            {i}
          </span>
        ))}
      </div>

      <div>
        <Trigger
          type={[
            UseTriggerType.click,
            UseTriggerType.focus,
            UseTriggerType.active,
          ]}
          onTrigger={evHandle}
        >
          <button
            onClick={(e) => {
              console.log("click", e);
            }}
          >
            click & focus & active
          </button>
        </Trigger>
      </div>
    </div>
  );
};

export default UseTriggerExample;
