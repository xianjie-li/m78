var StatusEnum;

(function (StatusEnum) {
  StatusEnum["info"] = "info";
  StatusEnum["success"] = "success";
  StatusEnum["warning"] = "warning";
  StatusEnum["error"] = "error";
})(StatusEnum || (StatusEnum = {}));

/* 40 | 32 | 24 */
var SizeEnum;

(function (SizeEnum) {
  SizeEnum["large"] = "large";
  SizeEnum["small"] = "small";
})(SizeEnum || (SizeEnum = {}));

var FullSizeEnum;

(function (FullSizeEnum) {
  FullSizeEnum["large"] = "large";
  FullSizeEnum["small"] = "small";
  FullSizeEnum["big"] = "big";
})(FullSizeEnum || (FullSizeEnum = {}));

var PositionEnum;

(function (PositionEnum) {
  PositionEnum["left"] = "left";
  PositionEnum["top"] = "top";
  PositionEnum["right"] = "right";
  PositionEnum["bottom"] = "bottom";
})(PositionEnum || (PositionEnum = {}));

var DirectionEnum;

(function (DirectionEnum) {
  DirectionEnum["horizontal"] = "horizontal";
  DirectionEnum["vertical"] = "vertical";
})(DirectionEnum || (DirectionEnum = {}));

export { DirectionEnum, FullSizeEnum, PositionEnum, SizeEnum, StatusEnum };
