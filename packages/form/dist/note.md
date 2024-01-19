## 要点备忘

- 单独提供 verify 版本用于更轻量的场景, 如服务端
- eachSchema 会在验证前根据当前子项的数量转换为 schema list
- 由于 valid 选项的特殊性, 需要在校验前移除 invalid 的值, 校验后应使用处理过 valid 选项的 values 副本而不是原对象
- schema 间会通过 dynamic 存在关联, 所以校验时需要获取每次完整的 schema
