import React, { useEffect } from "react";
import ColorModeToggle from "@theme-original/ColorModeToggle";

export default function ColorModeToggleWrapper(props) {
  useEffect(() => {
    document.documentElement.setAttribute("data-mode", props.value);
  }, [props.value]);
  return (
    <>
      <ColorModeToggle {...props} />
    </>
  );
}
