import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { isArray, isEmpty, isString } from "@lxjx/utils";
import { _PermissionProPieceType } from "./proType.js";
export var throwError = function(str) {
    throw Error("PermissionPro: ".concat(str));
};
/**
 * 传入验证key、验证器列表、依赖数据、额外数据。对该key进行验证后返回验证结果(void 或 ValidMeta)
 * */ export var validItem = function(key, validators, state, extra) {
    var validator = validators[key];
    // 不存在此验证器
    if (!validator) return;
    return validator(state, extra);
};
/**
 * 实现Permission api
 * */ export function permissionImpl(conf) {
    var permission = function(keys, config) {
        var validators = conf.validators, validFirst = conf.validFirst, seed = conf.seed;
        var state = seed.get();
        var _ref = config || {}, extra = _ref.extra, localValidators = _ref.validators;
        /** 所有验证失败结果 */ var rejects = [];
        /** 是否通过 */ var pass = true;
        /**
     * 传入单个权限key或key数组进行验证, 并将验证结果写入pass和rejects
     * 单个验证时: 验证该项并返回验证meta信息，验证正确时无返回
     * key数组时: 作为条件`or`进行验证，只要其中任意一项通过了验证则通过验证
     * */ var test = function(key, isOr) {
            if (isArray(key)) {
                var tempRejects = [];
                var flag = false;
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = key[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var pItem = _step.value;
                        var meta = test(pItem, true);
                        if (meta) {
                            tempRejects.push(meta);
                        }
                        // 成功任意一项即视为成功
                        if (!meta) {
                            flag = true;
                            break;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                if (!flag) {
                    var _rejects;
                    pass = false;
                    validFirst ? rejects.push(tempRejects[0]) : (_rejects = rejects).push.apply(_rejects, _to_consumable_array(tempRejects));
                }
            } else {
                var meta1 = validItem(key, _object_spread({}, validators, localValidators), state, extra);
                if (!meta1) return;
                // 非or时直接判定为失败
                if (!isOr) {
                    pass = false;
                    rejects.push(meta1);
                }
                return meta1;
            }
        };
        if (validFirst) {
            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                for(var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    var pItem = _step.value;
                    if (pass) {
                        test(pItem);
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        } else {
            keys.forEach(function(ak) {
                return test(ak);
            });
        }
        return rejects.length ? rejects : null;
    };
    permission.seed = conf.seed;
    return permission;
}
/**
 * ###############################################
 *                      Pro
 * ###############################################
 * */ /**
 * 将PermissionTpl转换为PermissionProAST, 如果格式错误则抛出异常
 * 首尾为特殊字符时异常
 * */ export function permissionProTplParser(tpl) {
    var invalidTip = "invalid permission template -> ".concat(tpl);
    var keyReg = /\w+|&|\||\(|\)/g;
    if (!tpl || !isString(tpl)) throwError(invalidTip);
    var _tpl_split = _sliced_to_array(tpl.split(":"), 2), mod = _tpl_split[0], keys = _tpl_split[1];
    if (!mod || !keys) throwError(invalidTip);
    var ast = [];
    var match = null;
    var bracketsFlag = false;
    var lastType = null;
    // eslint-disable-next-line no-cond-assign
    while((match = keyReg.exec(keys)) !== null){
        var s = match[0];
        var ls = bracketsFlag ? ast[ast.length - 1] : ast;
        switch(s){
            case "&":
                ls.push({
                    type: _PermissionProPieceType.and
                });
                lastType = _PermissionProPieceType.and;
                break;
            case "|":
                ls.push({
                    type: _PermissionProPieceType.or
                });
                lastType = _PermissionProPieceType.or;
                break;
            case "(":
                if (!isArray(ls) || bracketsFlag) throwError(invalidTip);
                ls.push([]);
                bracketsFlag = true;
                lastType = _PermissionProPieceType.leftBrackets;
                break;
            case ")":
                bracketsFlag = false;
                lastType = _PermissionProPieceType.rightBrackets;
                break;
            default:
                if (lastType === _PermissionProPieceType.rightBrackets) throwError(invalidTip);
                ls.push({
                    type: _PermissionProPieceType.key,
                    key: s
                });
                lastType = _PermissionProPieceType.key;
        }
    }
    if (!ast.length) throwError(invalidTip);
    return [
        mod,
        ast
    ];
}
/** 权限实现的主验证器key */ export var PERMISSION_PRO_NAME = "PERMISSION_PRO";
/**
 * PermissionPro内置验证器
 * */ export function permissionProValidatorGetter() {
    var validator = function(param, keys) {
        var permission = param.permission, meta = param.meta;
        // 没有传入要验证的权限
        if (!isArray(keys) || !keys.length) return null;
        var rejects = [];
        var checkItem = function(k) {
            var _permissionProTplParser = _sliced_to_array(permissionProTplParser(k), 2), mod = _permissionProTplParser[0], ast = _permissionProTplParser[1];
            return checkAST(ast, permission, mod, true, meta);
        };
        var pushEject = function(arg) {
            if (!arg.pass) {
                var _rejects;
                (_rejects = rejects).push.apply(_rejects, _to_consumable_array(arg.result.filter(function(item) {
                    return !item.pass;
                })));
            }
        };
        keys.forEach(function(item) {
            if (isArray(item)) {
                var temp = [];
                var passFlag = false;
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = item[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var string = _step.value;
                        var res = checkItem(string);
                        if (res.pass) {
                            passFlag = true;
                        } else {
                            temp.push(res);
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                !passFlag && temp.forEach(pushEject);
            } else {
                pushEject(checkItem(item));
            }
        });
        if (!rejects.length) return null;
        var rejectMeta = [];
        rejects.forEach(function(item) {
            var current = (meta === null || meta === void 0 ? void 0 : meta.each) ? meta.each(item.result) : item.result;
            var modKey = current.__mod;
            var moduleMeta = (meta === null || meta === void 0 ? void 0 : meta.modules) || {};
            var currentMod = moduleMeta[modKey];
            var label = modKey;
            if (!isArray(currentMod) && (currentMod === null || currentMod === void 0 ? void 0 : currentMod.label)) {
                label = currentMod.label;
            }
            var currentRejectMeta = rejectMeta.find(function(it) {
                return it.module === modKey;
            });
            if (!currentRejectMeta) {
                rejectMeta.push({
                    label: label,
                    module: modKey,
                    missing: [
                        current
                    ]
                });
            } else {
                currentRejectMeta.missing.push(current);
            }
            delete current.__mod;
        });
        return rejectMeta;
    };
    return validator;
}
/** 对一个PermissionProAST执行验证 */ export function checkAST(ast, permission, mod, isFirst, meta) {
    var result = [];
    var pass = false;
    var lastCondition = null;
    var lastPass;
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = ast[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var piece = _step.value;
            var res = null;
            if (isArray(piece)) {
                res = checkAST(piece, permission, mod, false, meta);
            } else if (piece.type === _PermissionProPieceType.key) {
                res = checkKeyPiece(piece, permission, mod, meta);
            }
            // 前一项为 & 和 | 时, 对比前后结果设置pass
            if (res && (lastCondition === _PermissionProPieceType.and || lastCondition === _PermissionProPieceType.or)) {
                if (lastPass === undefined) {
                    lastPass = result[result.length - 1].pass;
                }
                if (lastCondition === _PermissionProPieceType.and) {
                    pass = res.pass && lastPass;
                    lastPass = pass;
                }
                if (lastCondition === _PermissionProPieceType.or) {
                    pass = res.pass || lastPass;
                    lastPass = pass;
                }
            }
            if (res) result.push(res);
            // 当前项为 & 和 | 时标记
            if (!isArray(piece) && (piece.type === _PermissionProPieceType.and || piece.type === _PermissionProPieceType.or)) {
                lastCondition = piece.type;
            }
            // 不是则还原
            if (res) {
                lastCondition = null;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    if (isFirst) {
        var res1 = result.reduce(function(prev, item) {
            if (isArray(item.result)) {
                var _prev;
                (_prev = prev).push.apply(_prev, _to_consumable_array(item.result));
            } else {
                prev.push(item);
            }
            return prev;
        }, []);
        return {
            // 只有一项上面代码不会走到pass的流程, 直接使用该项的pass
            pass: res1.length === 1 ? res1[0].pass : pass,
            result: res1
        };
    }
    return {
        pass: pass,
        result: result
    };
}
/** 根据权限对单个key类型的PermissionProPiece进行检查 */ function checkKeyPiece(piece, permission, mod, meta) {
    var permissions = permission[mod];
    var result = getMeta(mod, piece.key, meta);
    if (!isArray(permissions) || !permissions.length) return {
        pass: false,
        result: result
    };
    var pass = permissions.includes(piece.key);
    return {
        pass: pass,
        result: result
    };
}
/** 根据key从指定meta配置中拿到其对应的meta信息, 没有则根据key和mod生成回退meta */ function getMeta(mod, key, meta) {
    var _meta_general, _meta_general1;
    var defaultMeta = {
        label: key,
        key: key,
        __mod: mod
    };
    if (!meta || !((_meta_general = meta.general) === null || _meta_general === void 0 ? void 0 : _meta_general.length) && isEmpty(meta.modules)) return defaultMeta;
    if (!isEmpty(meta.modules)) {
        var currentMeta = meta.modules[mod];
        var list = isArray(currentMeta) ? currentMeta : currentMeta === null || currentMeta === void 0 ? void 0 : currentMeta.list;
        if (list === null || list === void 0 ? void 0 : list.length) {
            var c = list.find(function(item) {
                return item.key === key;
            });
            if (c) return _object_spread_props(_object_spread({}, c), {
                __mod: mod
            });
        }
    }
    if ((_meta_general1 = meta.general) === null || _meta_general1 === void 0 ? void 0 : _meta_general1.length) {
        var c1 = meta.general.find(function(item) {
            return item.key === key;
        });
        if (c1) return _object_spread_props(_object_spread({}, c1), {
            __mod: mod
        });
    }
    return defaultMeta;
}
