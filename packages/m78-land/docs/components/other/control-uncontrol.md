---
title: 受控与非受控
---

所有表单控件均支持 `受控` `非受控` 两种使用方式, 可以在官方文档 [Controlled Components](https://reactjs.org/docs/forms.html#controlled-components) 和 [uncontrolled components](https://reactjs.org/docs/uncontrolled-components.html) 了解更多

<br/>

以下写法都是非受控组件:

```tsx
<Input />
<Input defaultValue="hello" />
<Input onChange={val => { console.log(val) }} />
```

以下写法为受控组件:

```tsx
const [value, setValue] = useState("hello");

<Input value={value} onChange={setValue} />
<Input value={value} onChange={val => setValue(val)} />
```
