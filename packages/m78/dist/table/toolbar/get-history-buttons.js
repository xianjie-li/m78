import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import { Bubble } from "../../bubble/index.js";
import { Button } from "../../button/index.js";
import { Size } from "../../common/index.js";
import { IconUndo } from "@m78/icons/icon-undo.js";
import { IconRedo } from "@m78/icons/icon-redo.js";
export function _getHistoryButtons(history) {
    var prev = history.getPrev();
    var next = history.getNext();
    var redoBtn = /*#__PURE__*/ _jsx(Bubble, {
        content: "撤销",
        children: /*#__PURE__*/ _jsx("span", {
            children: /*#__PURE__*/ _jsx(Button, {
                disabled: !prev,
                size: Size.small,
                squareIcon: true,
                onClick: function() {
                    return history.undo();
                },
                children: /*#__PURE__*/ _jsx(IconUndo, {
                    className: "color-second"
                })
            })
        })
    });
    var undoBtn = /*#__PURE__*/ _jsx(Bubble, {
        content: "重做",
        children: /*#__PURE__*/ _jsx("span", {
            className: "ml-12",
            children: /*#__PURE__*/ _jsx(Button, {
                disabled: !next,
                size: Size.small,
                squareIcon: true,
                onClick: function() {
                    return history.redo();
                },
                children: /*#__PURE__*/ _jsx(IconRedo, {
                    className: "color-second"
                })
            })
        })
    });
    return {
        redoBtn: redoBtn,
        undoBtn: undoBtn
    };
}
