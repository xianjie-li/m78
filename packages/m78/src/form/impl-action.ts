import { _Context, FormInstance } from "./types.js";
import { RejectMeta } from "@m78/verify";
import { isArray, stringifyNamePath } from "@m78/utils";
import clone from "lodash/cloneDeep.js";
import { _eachState, _getState } from "./common.js";
import debounce from "lodash/debounce.js";

export function _implAction(ctx: _Context) {
  const { instance } = ctx;

  instance.verify = async (name) => {
    const schema = instance.getSchemas();

    // 重置所有错误并在未指定name时设置touched状态
    _eachState(ctx, (st) => {
      st.errors = [];

      if (!name) {
        st.touched = true;
      }
    });

    // 传入name时设置指定项touched
    if (name) {
      const st = _getState(ctx, name);
      st.touched = true;
    }

    try {
      await instance.verifyInstance.asyncCheck(instance.getValues(), schema);
    } catch (err: any) {
      if (isArray(err)) {
        const errors: RejectMeta = [];

        // 将所有错误信息存储到state中, 并且根据是否传入name更新指定的touched
        (err as RejectMeta).forEach((meta) => {
          const st = _getState(ctx, meta.namePath);

          if (!st.errors) {
            st.errors = [];
          }

          st.errors?.push(meta);

          if (name) {
            if (stringifyNamePath(name) === stringifyNamePath(meta.namePath)) {
              st.touched = true;
              errors.push(meta);
            }
          } else {
            st.touched = true;
            errors.push(meta);
          }
        });

        if (errors.length) {
          instance.events.fail.emit(errors);
          throw errors;
        }
      } else {
        throw err;
      }
    } finally {
      if (!ctx.lockNotify) {
        instance.events.update.emit(name);
      }
    }
  };

  ctx.debounceVerify = debounce(instance.verify, 300, {
    leading: false,
    trailing: true,
  }) as FormInstance["verify"];

  instance.submit = async () => {
    await instance.verify();
    instance.events.submit.emit();
  };

  instance.reset = () => {
    ctx.values = clone(ctx.defaultValue);
    ctx.state = {};

    if (!ctx.lockNotify) {
      instance.events.change.emit();
      instance.events.update.emit();
    }

    instance.events.reset.emit();
  };
}
