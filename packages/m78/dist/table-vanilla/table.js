import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { _TableInitPlugin } from "./plugins/init.js";
import { _TableRenderPlugin } from "./plugins/render.js";
import { createEvent, getNamePathValue, setNamePathValue } from "@m78/utils";
import { _privateInstanceKey } from "./common.js";
import { _TableLifePlugin } from "./plugins/life.js";
import { _TableGetterPlugin } from "./plugins/getter.js";
import { _TableEventPlugin } from "./plugins/event.js";
import { _TableHeaderPlugin } from "./plugins/header.js";
import { _TableHistoryPlugin } from "./plugins/history.js";
import { _TableScrollMarkPlugin } from "./plugins/scroll-mark.js";
import { _TableAutoResizePlugin } from "./plugins/auto-resize.js";
import { _TableConfigPlugin } from "./plugins/config.js";
import { _TableSelectPlugin } from "./plugins/select.js";
import { _TableRowColumnResize } from "./plugins/row-column-resize.js";
import { _TableMutationPlugin } from "./plugins/mutation.js";
import { _TablePluginEmpty } from "./plugins/empty.js";
import { _TableHidePlugin } from "./plugins/hide.js";
import { _TableHighlightPlugin } from "./plugins/highlight.js";
import { _TableSortColumnPlugin } from "./plugins/sort-column.js";
import { _TableDragSortPlugin } from "./plugins/drag-sort.js";
import { _TableDisablePlugin } from "./plugins/disable.js";
import { _TableDragMovePlugin } from "./plugins/drag-move.js";
import { _TableKeyboardInteractionPlugin } from "./plugins/keyboard-interaction.js";
import { _TableInteractiveCorePlugin } from "./plugins/interactive-core.js";
import { _TableIsPlugin } from "./plugins/is.js";
import { _TableSetterPlugin } from "./plugins/setter.js";
import { _TableFormPlugin } from "./plugins/form.js";
import { _TableFeedbackPlugin } from "./plugins/feedback.js";
import { _TableSoftRemovePlugin } from "./plugins/soft-remove.js";
import { _TableMetaDataPlugin } from "./plugins/meta-data.js";
import { CacheTick } from "./plugins/frame-cache.js";
/**
 * 核心功能, 在非框架环境下实现, 以便在日后进行移植
 * */ export function _createTable(config) {
    var // 用户插件
    _pluginConfig_plugins, _pluginConfig_plugins1;
    var defaultConfig = {
        data: [],
        columns: [],
        rows: {},
        cells: {},
        plugins: [],
        rowHeight: 36,
        columnWidth: 100,
        emptySize: 100,
        autoSize: true,
        stripe: true,
        border: true,
        cellSelectable: true,
        rowSelectable: true
    };
    // 根据dom上挂载的私有实例信息判断是否需要创建实例, 防止热重载等场景下反复创建
    var ins = getNamePathValue(config.el, _privateInstanceKey);
    // 已存在实例时, 直接返回
    if (ins) {
        ins.render();
        return ins;
    }
    var conf = _object_spread({}, defaultConfig, config);
    var initContext = {
        getterCache: new CacheTick()
    };
    // fill props by late
    var context = initContext;
    var eventCreator = conf.eventCreator ? conf.eventCreator : createEvent;
    var event = {
        error: eventCreator(),
        click: eventCreator(),
        resize: eventCreator(),
        select: eventCreator(),
        selectStart: eventCreator(),
        rowSelect: eventCreator(),
        cellSelect: eventCreator(),
        mutation: eventCreator(),
        mountChange: eventCreator(),
        init: eventCreator(),
        initialized: eventCreator(),
        mounted: eventCreator(),
        rendering: eventCreator(),
        rendered: eventCreator(),
        reload: eventCreator(),
        beforeDestroy: eventCreator(),
        interactiveChange: eventCreator(),
        feedback: eventCreator(),
        dragMoveChange: eventCreator()
    };
    // 不完整的实例
    var instance = {
        event: event
    };
    // 插件创建配置
    var pluginConfig = {
        table: instance,
        plugins: [],
        context: context,
        config: conf
    };
    context.plugins = pluginConfig.plugins;
    setNamePathValue(instance, "__ctx", context);
    // 内置插件
    // 注意: 在实现上, 鉴于完整功能的复杂度, 内部插件之间并不是完全解耦的, 插件之间会互相访问状态/方法
    // 比如初始化阶段, 不同插件可能都需要对配置和数据进行遍历, 预计算等, 这些操作应该在单次完成, 避免重复计算.
    var plugins = [
        _TableMetaDataPlugin,
        _TableInitPlugin,
        _TablePluginEmpty,
        _TableLifePlugin,
        _TableGetterPlugin,
        _TableSetterPlugin,
        _TableIsPlugin,
        _TableHistoryPlugin,
        _TableMutationPlugin,
        _TableConfigPlugin,
        _TableEventPlugin,
        _TableHeaderPlugin,
        _TableHidePlugin,
        _TableSortColumnPlugin,
        _TableDragSortPlugin,
        _TableRenderPlugin,
        _TableScrollMarkPlugin,
        _TableDragMovePlugin,
        _TableSelectPlugin,
        _TableDisablePlugin,
        _TableSoftRemovePlugin,
        _TableAutoResizePlugin,
        _TableRowColumnResize,
        _TableKeyboardInteractionPlugin,
        _TableInteractiveCorePlugin,
        _TableFeedbackPlugin,
        _TableFormPlugin,
        _TableHighlightPlugin
    ].map(function(Plugin) {
        return new Plugin(pluginConfig);
    });
    (_pluginConfig_plugins = pluginConfig.plugins).push.apply(_pluginConfig_plugins, _to_consumable_array(plugins));
    // 用户插件
    var customPlugins = conf.plugins.map(function(Plugin) {
        // 传入的是插件实例时, 直接使用, 用于上层react组件扩展插件系统
        if (typeof Plugin === "object") {
            Plugin.table = pluginConfig.table;
            Plugin.plugins = pluginConfig.plugins;
            Plugin.context = pluginConfig.context;
            Plugin.config = pluginConfig.config;
            return Plugin;
        } else {
            return new Plugin(pluginConfig);
        }
    });
    (_pluginConfig_plugins1 = pluginConfig.plugins).push.apply(_pluginConfig_plugins1, _to_consumable_array(customPlugins));
    /* # # # # # # # init # # # # # # # */ pluginConfig.plugins.forEach(function(plugin) {
        var _plugin_beforeInit;
        (_plugin_beforeInit = plugin.beforeInit) === null || _plugin_beforeInit === void 0 ? void 0 : _plugin_beforeInit.call(plugin);
    });
    pluginConfig.plugins.forEach(function(plugin) {
        var _plugin_init;
        (_plugin_init = plugin.init) === null || _plugin_init === void 0 ? void 0 : _plugin_init.call(plugin);
    });
    event.init.emit();
    pluginConfig.plugins.forEach(function(plugin) {
        var _plugin_initialized;
        (_plugin_initialized = plugin.initialized) === null || _plugin_initialized === void 0 ? void 0 : _plugin_initialized.call(plugin);
    });
    event.initialized.emit();
    instance.render();
    /* # # # # # # # mount # # # # # # # */ pluginConfig.plugins.forEach(function(plugin) {
        var _plugin_mounted;
        (_plugin_mounted = plugin.mounted) === null || _plugin_mounted === void 0 ? void 0 : _plugin_mounted.call(plugin);
    });
    event.mounted.emit();
    console.log(context);
    return instance;
}
