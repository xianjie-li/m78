import { triggerHighlight } from "../dist";

window.addEventListener("load", () => {
  document.getElementById("button3").addEventListener("click", () => {
    triggerHighlight("#button1", {
      useOutline: false,
    });
    // triggerHighlight("#button2");
  });
});
