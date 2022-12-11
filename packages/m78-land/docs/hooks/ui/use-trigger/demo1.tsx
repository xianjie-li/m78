import * as React from "react";
import {
  useSetState,
  useTrigger,
  UseTriggerEvent,
  UseTriggerType,
} from "@m78/hooks";

const Demo1 = () => {
  const [state, setState] = useSetState({
    focus: false,
    active: false,
    text: [] as string[],
  });

  const trigger = useTrigger({
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
    onTrigger: (e: UseTriggerEvent) => {
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
    },
  });

  const trigger2 = useTrigger({
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
        {trigger.node} {trigger2.node}
      </div>
      <div>
        {state.text.map((i, ind) => (
          <span key={ind} style={{ marginLeft: 12 }}>
            {i}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Demo1;
