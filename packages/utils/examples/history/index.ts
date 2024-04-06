import { ActionHistory } from "../../src";

const list = [1, 2, 3, 4];

const history = new ActionHistory();

history.redo({
    redo() {
        console.log("redo");

        list.splice(1, 1);
    },
    undo() {
        console.log("undo");
        list.splice(1, 0, 2);
    },
});

console.log(list);

history.undo();

console.log(list);

history.redo();

console.log(list);
