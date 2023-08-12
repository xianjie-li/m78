import { _Context, _State } from "./types.js";
import { RejectMeta, VerifyError } from "@m78/verify";
import { ensureArray, isArray, isEmpty, stringifyNamePath } from "@m78/utils";
import clone from "lodash/cloneDeep.js";
import { _eachState, _getState, _isRelationName } from "./common.js";

export function _implAction(ctx: _Context) {
  const { instance } = ctx;

  instance.verify = async (name) => {
    const schema = instance.getSchemas();

    const isValueChangeTrigger = ctx.isValueChangeTrigger;

    ctx.isValueChangeTrigger = false;

    const resetState = (st: _State) => {
      if (name) {
        // 含 name 时, 清理自身及子级/父级的 error 状态
        const isRelationName = _isRelationName(
          ensureArray(name),
          ensureArray(st.name)
        );

        if (isRelationName) {
          st.errors = [];
        }
      } else {
        st.errors = [];
        st.touched = true;
      }
    };

    // 需要在成功或失败后马上重置, 然后再执行后续处理, 防止多个verify产生的竞态问题
    const resetErrorAndTouch = () => {
      // 重置所有错误并在未指定name时设置touched状态
      _eachState(ctx, resetState);

      // 指定了项
      if (name) {
        const st = _getState(ctx, name);

        resetState(st);
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

            if (!isEmpty(st.errors)) {
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
            instance.events.fail.emit(errors, isValueChangeTrigger);
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

  // 存放debounceVerify计时器
  const debounceVerifyTimerMap: any = {};

  // 防止debounceVerify在单次触发时执行两次
  let firstTriggerFlag = false;

  instance.debounceVerify = (name, cb) => {
    const key = stringifyNamePath(name || []) || "default";

    const isValueChangeTrigger = ctx.isValueChangeTrigger;

    ctx.isValueChangeTrigger = false;

    // 立即执行一次
    if (!debounceVerifyTimerMap[key]) {
      if (isValueChangeTrigger) {
        ctx.isValueChangeTrigger = true;
      }
      firstTriggerFlag = true;
      instance
        .verify(name)
        .then(() => {
          cb?.();
        })
        .catch((err) => {
          cb?.(err?.rejects);
        });
    } else {
      firstTriggerFlag = false;
    }

    if (debounceVerifyTimerMap[key]) {
      clearTimeout(debounceVerifyTimerMap[key]);
    }

    debounceVerifyTimerMap[key] = setTimeout(() => {
      if (isValueChangeTrigger) {
        ctx.isValueChangeTrigger = true;
      }

      delete debounceVerifyTimerMap[key];

      if (!firstTriggerFlag) {
        instance
          .verify(name)
          .then(() => {
            cb?.();
          })
          .catch((err) => {
            cb?.(err?.rejects);
          });
      }
    }, 200);
  };

  instance.submit = async () => {
    await instance.verify();

    instance.events.submit.emit();
  };

  instance.reset = () => {
    ctx.values = clone(ctx.defaultValue);
    ctx.state = {};

    // 清空现有list信息, 并使用新的values进行一次刷新, 同步list
    ctx.listState = {};

    if (!ctx.lockNotify) {
      instance.events.change.emit();
      instance.events.update.emit();
    }

    instance.events.reset.emit();
  };
}
