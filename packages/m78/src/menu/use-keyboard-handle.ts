import { useFn, useKeyboard } from "@m78/hooks";
import { _Context, _FlatOption, MenuOption } from "./types.js";
import { getValueByDataSource } from "../common/index.js";
import { _flatOptions, _getOptionAllValues } from "./common.js";
import { useEffect } from "react";

export function useKeyboardHandle(ctx: _Context) {
  const {
    hasSelected,
    props,
    openSelect,
    openChangeHandle,
    self,
    state,
    setState,
    close,
  } = ctx;

  /** 同步生成flat map */
  useEffect(() => {
    self.flatMap = _flatOptions(props.options);
  }, [props.options]);

  /** 关闭指定列表的所有项 */
  const closeList = useFn((sibling: MenuOption[]) => {
    const values = _getOptionAllValues(sibling, props);
    openSelect.unSelectList(values);
  });

  useKeyboard({
    onTrigger: ({ code, nativeEvent }) => {
      nativeEvent.preventDefault();

      if (!state.current && !self.lastActive) {
        setState({
          current: props.options[0] || null,
        });
        return;
      }

      let flatOption: _FlatOption | undefined;

      if (self.lastActive) {
        flatOption = self.flatMap[self.lastActive];
        self.lastActive = null;
      }

      if (!flatOption && state.current) {
        flatOption = self.flatMap[getValueByDataSource(state.current)!];
      }

      if (!flatOption) return;

      if (code === "ArrowDown") {
        setState({
          current: flatOption.next || null,
        });
      }

      if (code === "ArrowUp") {
        setState({
          current: flatOption.prev || null,
        });
      }

      if (code === "ArrowRight") {
        openChangeHandle(true, flatOption.value, flatOption.siblings, true);

        if (flatOption.child) {
          setState({
            current: flatOption.child || null,
          });
        }
      }

      if (code === "ArrowLeft") {
        if (!flatOption.parent) return;

        const parentOption =
          self.flatMap[getValueByDataSource(flatOption.parent)!];

        closeList(parentOption.siblings);

        setState({
          current: flatOption.parent || null,
        });
      }
    },
    priority: 1000,
    code: ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"],
    enable: hasSelected,
  });

  useKeyboard({
    onTrigger: (e) => {
      e.nativeEvent.preventDefault();
      if (state.current) {
        e.code !== "Escape" &&
          props.onConfirm?.(
            getValueByDataSource(state.current)!,
            state.current
          );
        close();
      }
    },
    priority: 1000,
    code: ["Enter", "Space", "Escape"],
    enable: hasSelected,
  });
}
