import React, { isValidElement } from "react";
import {
  _FormContext,
  _FieldContext,
  FormFieldProps,
  FormListCustomRenderArgs,
  FormListProps,
  FormSchema,
  FormSchemaWithoutName,
} from "./types.js";
import { ensureArray, isFunction, isTruthyOrZero } from "@m78/utils";
import { throwError } from "../common/index.js";
import { DND } from "../dnd/index.js";
import { Row } from "../layout/index.js";
import clsx from "clsx";
import { Button } from "../button/index.js";
import { IconDeleteSweep } from "@m78/icons/icon-delete-sweep.js";
import { IconDragIndicator } from "@m78/icons/icon-drag-indicator.js";
import { IconAddCircleOutline } from "@m78/icons/icon-add-circle-outline.js";
import { _UseFieldMethods } from "./use-field-methods.js";
import { FORM_NS, Translation } from "../i18n/index.js";
import { EMPTY_LIST_NAME } from "./common.js";

export function _listImpl(ctx: _FormContext) {
  const { form } = ctx;

  form.List = (props) => {
    return (
      <form.Field
        {...(props as any as FormFieldProps)}
        // @ts-ignore
        __isList
      />
    );
  };

  (form.List as React.FunctionComponent).displayName = "FieldList";
}

/** FormListCustomRenderArgs.render核心逻辑实现 */
export function _listRenderImpl(
  ctx: _FormContext,
  props: FormFieldProps
): FormListCustomRenderArgs["render"] {
  const { form } = ctx;
  const { name = EMPTY_LIST_NAME } = props;

  return (renderCB) => {
    if (!isFunction(renderCB)) {
      throwError("Form: List args.render must passed a function as argument.");
    }

    const list = form.getList(name) || [];

    const listNode = list.map((i, index) => {
      const element = renderCB({
        item: i.item,
        index,
        length: list.length,
        getName: (childName) => [
          ...ensureArray(name),
          index,
          ...ensureArray(childName),
        ],
      });

      if (!isValidElement<any>(element)) {
        throwError(`Form: List args.render must return a valid react element.`);
      }

      return React.cloneElement(element, {
        ...element.props,
        key: i.key,
      });
    });

    return <>{listNode}</>;
  };
}

/** 实现内置list布局 */
export function _listLayoutRenderImpl(
  filedCtx: _FieldContext,
  methods: _UseFieldMethods,
  schema: FormSchema | FormSchemaWithoutName | null
) {
  const group = `${filedCtx.id}-${filedCtx.strName}`;

  return function (
    args: FormListCustomRenderArgs,
    render: NonNullable<FormListProps["layoutRender"]>
  ) {
    return (
      <div className="m78-form_list-wrap">
        {args.render((meta) => {
          const node = render(meta);

          return (
            <DND
              group={group}
              data={meta.index}
              enableDrag
              enableDrop={{ top: true, bottom: true }}
              draggingListen
              onSourceAccept={({ source, target, status }) => {
                const sIndex = source.data;
                const tIndex = target.data;
                const isDropTop = status.top;
                const isDropBottom = status.bottom;

                const isIncrement = tIndex > sIndex;

                const topIndex = Math.max(0, isIncrement ? tIndex - 1 : tIndex);
                const bottomIndex = Math.min(
                  meta.length - 1,
                  isIncrement ? tIndex : tIndex + 1
                );

                isDropTop && args.move(sIndex, topIndex);
                isDropBottom && args.move(sIndex, bottomIndex);
              }}
            >
              {({ status, ref, handleRef }) => {
                return (
                  <Row
                    innerRef={ref}
                    className={clsx("m78-form_list-item", {
                      ["__d-top"]: status.top,
                      ["__d-bottom"]: status.bottom,
                      __dragging: status.dragging,
                      ["__has-dragging"]: status.hasDragging,
                    })}
                  >
                    {node}
                    <div className="m78-form_multi-column_suffix">
                      <Translation ns={[FORM_NS]}>
                        {(t) => (
                          <Button
                            icon
                            size="small"
                            squareIcon
                            title={t("delete current item") as string}
                            onClick={() => {
                              args.remove(meta.index);
                            }}
                          >
                            <IconDeleteSweep />
                          </Button>
                        )}
                      </Translation>
                      <Translation ns={[FORM_NS]}>
                        {(t) => (
                          <Button
                            icon
                            size="small"
                            squareIcon
                            title={t("drag sort") as string}
                            innerRef={handleRef}
                          >
                            <IconDragIndicator />
                          </Button>
                        )}
                      </Translation>
                    </div>
                  </Row>
                );
              }}
            </DND>
          );
        })}

        <div className="m78-form_list-actions">
          <Button
            disabled={args.getProps("disabled")}
            onClick={() =>
              args.add(
                isTruthyOrZero(schema?.listDefaultValue)
                  ? schema!.listDefaultValue
                  : {}
              )
            }
            size={methods.getProps("size")}
          >
            <Translation ns={[FORM_NS]}>{(t) => t("add item")}</Translation>
            <IconAddCircleOutline />
          </Button>
        </div>
      </div>
    );
  };
}
