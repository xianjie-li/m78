export var _TablePrivateProperty;
(function(_TablePrivateProperty) {
    _TablePrivateProperty[/** 表示是由table注入的数据 */ "fake"] = "__M78TableFake";
    _TablePrivateProperty[/** 表示关联数据或对其的引用 */ "ref"] = "__M78TableRef";
    _TablePrivateProperty[/** 该条数据需要在计算/渲染时被忽略 */ "ignore"] = "__M78TableIgnore";
    _TablePrivateProperty[/** 该条数据需要在计算/渲染时被忽略, 用于区分与ignore不同的场景 */ "hide"] = "__M78TableHide";
    _TablePrivateProperty[/** 与对象有关的某个timer */ "timer"] = "__M78TableTimer";
    _TablePrivateProperty[/** 记录当前reloadKey */ "reloadKey"] = "__M78TableReloadKey";
    _TablePrivateProperty[/** 挂载渲染标记 */ "renderFlag"] = "__M78TableRenderFlag";
    _TablePrivateProperty[/** 表示该数据为新增数据 */ "newFlag"] = "__M78TableNew";
})(_TablePrivateProperty || (_TablePrivateProperty = {}));
export var TableRowFixed;
(function(TableRowFixed) {
    TableRowFixed["top"] = "top";
    TableRowFixed["bottom"] = "bottom";
})(TableRowFixed || (TableRowFixed = {}));
export var TableColumnFixed;
(function(TableColumnFixed) {
    TableColumnFixed["left"] = "left";
    TableColumnFixed["right"] = "right";
})(TableColumnFixed || (TableColumnFixed = {}));
