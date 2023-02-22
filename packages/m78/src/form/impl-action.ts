import { _Context, FormInstance } from "./types.js";
import { RejectMeta, VerifyError } from "@m78/verify";
import { isArray, stringifyNamePath } from "@m78/utils";
import clone from "lodash/cloneDeep.js";
import { _eachState, _getState } from "./common.js";
import debounce from "lodash/debounce.js";

export function _implAction(ctx: _Context) {
  const { instance } = ctx;

  instance.verify = async (name) => {
    const schema = instance.getSchemas();

    // 需要在成功或失败后马上重置, 然后再执行后续处理, 反正多个verify产生的竞态问题
    const resetErrorAndTouch = () => {
      // 重置所有错误并在未指定name时设置touched状态
      _eachState(ctx, (st) => {
        if (!name) {
          st.errors = [];
          st.touched = true;
        }
      });

      // 传入name时设置指定项touched
      if (name) {
        const st = _getState(ctx, name);
        st.errors = [];
        st.touched = true;
      }
    };

    try {
      await instance.verifyInstance.asyncCheck(instance.getValues(), schema);
      resetErrorAndTouch();
    } catch (e: any) {
      resetErrorAndTouch();

      if (e instanceof VerifyError) {
        const reject = e.rejects;

        if (isArray(reject)) {
          const errors: RejectMeta = [];

          // 将所有错误信息存储到state中, 并且根据是否传入name更新指定的touched
          reject.forEach((meta) => {
            const st = _getState(ctx, meta.namePath);

            if (!st.errors) {
              st.errors = [];
            }

            st.errors?.push(meta);

            if (name) {
              if (
                stringifyNamePath(name) === stringifyNamePath(meta.namePath)
              ) {
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
            throw new VerifyError(errors);
          }
        }
      }

      throw e;
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

    // 清空现有list信息, 并使用新的values进行一次刷新, 同步list
    ctx.listData = {};
    ctx.syncLists();

    if (!ctx.lockNotify) {
      instance.events.change.emit();
      instance.events.update.emit();
    }

    instance.events.reset.emit();
  };
}
