import React from "react";
import {
  _FormContext,
  FormLayoutType,
  FormSchema,
  FormSchemaWithoutName,
} from "./types.js";
import { ensureArray, NameItem } from "@m78/utils";
import { Button, ButtonColor } from "../button/index.js";
import { Cell, Cells, Row } from "../layout/index.js";
import { _useUpdatePropsChange } from "./use-update-props-change.js";
import { useUpdate } from "@m78/hooks";
import { COMMON_NS, FORM_NS, Translation } from "../i18n/index.js";
import { EMPTY_NAME } from "./common.js";
import { Bubble, BubbleType } from "../bubble/index.js";
import { Status } from "../common/index.js";

export function _schemaRenderImpl(ctx: _FormContext) {
  const { form } = ctx;

  form.SchemaRender = (props) => {
    const { showActionButtons = true } = props;
    const { config } = ctx;
    const schemas = config.schemas;

    // 监听updateProps更新组件
    _useUpdatePropsChange(ctx, useUpdate());

    form.events.submit.useEvent((data) => {
      if (props.onSubmit) {
        props.onSubmit(data);
      }
    });

    // 渲染一项schema
    function renderSchemaItem(
      schema: FormSchemaWithoutName | FormSchema | undefined,
      parentNames: NameItem[],
      isRoot = false,
      isSchemaRoot = false
    ) {
      if (!schema) return null;

      // 需要添加到所有field的props
      const commonFiledProps: any = {};

      // 没有name且非root schema视为无效schema
      if (!("name" in schema) && !isRoot) return null;

      const name = [...parentNames];

      if ("name" in schema) name.push(schema.name);

      if (!schema.list) {
        // 包含schema配置
        if (schema.schemas?.length) {
          const node: any = schema.schemas!.map((sch) => {
            if (isRoot) return renderSchemaItem(sch, name, false, isRoot);

            // 嵌套菜单渲染为多列
            return (
              // 使用createElement展开, 所以不需要key
              // eslint-disable-next-line react/jsx-key
              <div className="m78-form_multi-column">
                {renderSchemaItem(sch, name)}
              </div>
            );
          });

          const nodeWrap = React.createElement(React.Fragment, {}, ...node);

          // 根节点不需要容器
          if (isRoot) return nodeWrap;

          return renderCellCond(
            isSchemaRoot,
            <form.Field
              {...commonFiledProps}
              name={name}
              element={() => <Row>{nodeWrap}</Row>}
            />
          );
        }

        // eachSchema只对list有效
        if (schema.eachSchema) return null;

        // console.log(name);

        return renderCellCond(
          isSchemaRoot,
          <form.Field {...commonFiledProps} name={name} />
        );
      }

      // list模式只有配置了eachSchema才有效
      if (!schema.eachSchema) return null;

      const eachSchema = schema.eachSchema;

      return renderCellCond(
        isSchemaRoot,
        <form.List
          {...commonFiledProps}
          name={name}
          layoutRender={(meta) => {
            let node: JSX.Element[];

            if (eachSchema.schemas) {
              node = eachSchema.schemas!.map((sch) => (
                // eslint-disable-next-line react/jsx-key
                <div className="m78-form_multi-column">
                  {renderSchemaItem(sch, ensureArray(meta.getName()))}
                </div>
              ));
            } else {
              // eslint-disable-next-line react/jsx-key
              node = [<form.Field name={meta.getName()} />];
            }

            return React.createElement(React.Fragment, {}, ...node);
          }}
        />
      );
    }

    // 根据条件渲染Cell或直接渲染原节点
    function renderCellCond(isSchemaRoot: boolean, node: React.ReactNode) {
      if (isSchemaRoot) {
        return (
          <Cell col={12} {...props.cellProps}>
            {node}
          </Cell>
        );
      }

      return node;
    }

    const formNode = renderSchemaItem(
      schemas as FormSchemaWithoutName, // config中的schema已经过处理, 不会是数组类型
      [],
      true
    );

    if (!formNode) return null;

    const hasCellGutter =
      !!props.cellProps && config.layoutType === FormLayoutType.vertical;

    return (
      <Cells gutter={hasCellGutter ? 12 : 0} {...props.cellsProps}>
        {formNode}

        {showActionButtons &&
          renderCellCond(
            true,
            <form.Field
              name={EMPTY_NAME}
              label=" "
              element={() => (
                <div>
                  <Translation ns={[FORM_NS, COMMON_NS]}>
                    {(t) => (
                      <Bubble
                        type={BubbleType.confirm}
                        content={t("confirm operation")}
                        status={Status.warning}
                        onConfirm={form.reset}
                      >
                        <Button size={config.size}>{t("reset")}</Button>
                      </Bubble>
                    )}
                  </Translation>

                  <Button
                    style={{ minWidth: 80 }}
                    color={ButtonColor.primary}
                    onClick={() => {
                      form.submit().catch(() => {});
                    }}
                    size={config.size}
                  >
                    <Translation ns={FORM_NS}>{(t) => t("submit")}</Translation>
                  </Button>
                </div>
              )}
            />
          )}
      </Cells>
    );
  };

  form.SchemaRender.displayName = "SchemaRender";
}
