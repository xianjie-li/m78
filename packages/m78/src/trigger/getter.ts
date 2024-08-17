import {
  BoundSize,
  ensureArray,
  isArray,
  isBoolean,
  isFunction,
} from "@m78/utils";
import { _isBound } from "./methods.js";
import {
  _defaultLevel,
  _defaultOverrideStrategy,
  _defaultCursorConf,
} from "./common.js";
import {
  TriggerOption,
  _TriggerContext,
  TriggerTargetData,
  TriggerOverrideStrategy,
  TriggerType,
} from "./types.js";

/** 事件对象更新和获取 */
export function _checkGetter(ctx: _TriggerContext) {
  // 将从dom读取的bound进行缓存, 防止频繁读取, 并没隔一段时间清理一次
  const domBoundCacheMap = new Map<HTMLElement, DOMRect>();

  const t = setInterval(() => {
    domBoundCacheMap.clear();
  }, 200);

  ctx.trigger.getTargetByXY = (args): TriggerTargetData[] => {
    return ctx.getEventList(args).eventList;
  };

  /** 获取选项和选项数据列表 */
  ctx.getEventList = function getEventList(args) {
    const { xy, type, filter, dom, looseXYCheck } = args;

    const list: TriggerTargetData[] = [];
    const optList: TriggerOption[] = [];
    let eventList: TriggerTargetData[] = [];

    const checkTypeList = ensureArray(type);

    const itemHandle = (opt: TriggerOption) => {
      const eType = getTypeMap(opt);

      // 需要过滤类型
      if (checkTypeList.length) {
        let has = false;
        for (let i = 0; i < checkTypeList.length; i++) {
          if (eType.get(checkTypeList[i])) {
            has = true;
            break;
          }
        }

        if (!has) return;
      }

      const data = getDataByOption(opt, eType);

      const optEnable = data.option.enable;

      if (isBoolean(optEnable) && !optEnable) return;
      if (isFunction(optEnable) && optEnable(data) === false) return;
      if (filter && filter(data) === false) return;

      optList.push(opt);
      list.push(data);

      let inBound = false;
      let isPass = false;

      if (xy && inBoundCheck(xy[0], xy[1], data.bound)) {
        inBound = true;
      }

      // 需根据dom检测, 且当前事件选项target是真实dom
      if (dom && !data.isVirtual) {
        // 需要进行dom检测
        if (looseXYCheck || !xy || (xy && inBound)) {
          // 复用isBound检测可减少 contains 的直接调用
          isPass = data.dom.contains(dom);
        }
      } else if (inBound) {
        isPass = true;
      }

      if (isPass) {
        eventList.push(data);
      }
    };

    for (let i = 0; i < ctx.optionList.length; i++) {
      const item = ctx.optionList[i];

      if (isArray(item)) {
        for (let j = 0; j < item[1].length; j++) {
          const cur = item[1][j];

          itemHandle(cur);
        }
      } else {
        itemHandle(item);
      }
    }

    if (!xy) {
      eventList = list.slice();
    }

    // 处理冲突事件
    if (eventList.length) {
      let maxLevel = 0;
      const _list: TriggerTargetData[] = [];

      // 找出最大level的所有data
      eventList.forEach((i) => {
        const level = i.option.level || _defaultLevel;

        if (level === maxLevel) {
          _list.push(i);
        } else if (level > maxLevel) {
          _list.length = 0;
          _list.push(i);
          maxLevel = level;
        }
      });

      // 若包含多个事件, 使用策略进行过滤
      if (_list.length > 1) {
        const finalList: TriggerTargetData[] = [];

        _list.forEach((i, ind) => {
          const strategy: TriggerOverrideStrategy =
            i.option.overrideStrategy ?? _defaultOverrideStrategy;

          // 已经是最后一项, 且仍没有事件被持有
          if (ind === _list.length - 1 && !finalList.length) {
            finalList.push(i);
            return;
          }

          // 并行项
          if (strategy === TriggerOverrideStrategy.parallel) {
            finalList.push(i);
            return;
          }

          // 独占项
          if (strategy === TriggerOverrideStrategy.possess) {
            finalList.push(i);
            return;
          }

          // transfer
        });

        eventList = finalList;
      } else {
        eventList = _list;
      }
    }

    return {
      list,
      optList,
      eventList,
    };
  };

  ctx.updateTargetData = (data) => {
    return getDataByOption(data.option, data.typeMap);
  };

  ctx.getDataByOption = getDataByOption;

  /** 从 TriggerOption 获取 typeMap */
  function getTypeMap(opt: TriggerOption): Map<TriggerType, boolean> {
    const typeArr = ensureArray(opt.type);
    if (!typeArr.length) return new Map();

    const m = new Map();

    typeArr.forEach((i) => m.set(i, true));

    return m;
  }

  function clearCache() {
    clearInterval(t);
    domBoundCacheMap.clear();
  }

  /** 从 TriggerOption 获取 _TriggerTargetData */
  function getDataByOption(
    opt: TriggerOption,
    typeMap?: Map<TriggerType, boolean>
  ): TriggerTargetData {
    const cursor = {
      ..._defaultCursorConf,
      ...opt.cursor,
    };

    if (!typeMap) {
      typeMap = getTypeMap(opt);
    }

    if (!opt.target) {
      console.log(opt, opt.target, 22);
    }

    if (_isBound(opt.target)) {
      return {
        isVirtual: true,
        bound: opt.target,
        dom: null as any,
        option: opt,
        cursor,
        typeMap,
      };
    } else {
      let rect = domBoundCacheMap.get(opt.target);

      if (!rect) {
        rect = opt.target.getBoundingClientRect();
        domBoundCacheMap.set(opt.target, rect);
      }

      return {
        isVirtual: false,
        bound: {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        },
        dom: opt.target,
        option: opt,
        cursor,
        typeMap,
      };
    }
  }

  /** 检测xy是否在指定bound内 */
  function inBoundCheck(x: number, y: number, bound: BoundSize) {
    const { left, top, width, height } = bound;
    return x >= left && x <= left + width && y >= top && y <= top + height;
  }

  return {
    clearCache,
  };
}
