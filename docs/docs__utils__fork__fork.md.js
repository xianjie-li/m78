(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[112,108,109,110,111],{"+PjD":function(e,n,t){"use strict";t.r(n);var a=t("0Owb"),r=t("q1tI"),l=t.n(r),o=t("kr9X"),c=t("lgaZ"),i=()=>new Promise((e,n)=>{setTimeout(()=>{var t=Math.random();if(t<.5)n(new Error("\u52a0\u8f7d\u5f02\u5e38"));else{var a=Array.from({length:Math.random()>.5?0:8}).map(()=>Math.random());e(a)}},1e3)}),d=()=>{var e=Object(c["d"])(i,{timeout:Math.random()>.7?500:8e3});return l.a.createElement("div",null,l.a.createElement("div",{className:"mb-12"},l.a.createElement("button",{type:"button",disabled:e.loading,onClick:e.send},e.loading?"\u52a0\u8f7d\u4e2d":"\u53d1\u8d77\u8bf7\u6c42")),l.a.createElement(o["default"],Object(a["a"])({hasData:e.data&&e.data.length},e),()=>l.a.createElement("ul",null,e.data.map(e=>l.a.createElement("li",{key:e},"rand num: ",e)))))};n["default"]=d},"1p7j":function(e,n,t){"use strict";t("GTID"),t("TcRa");var a=t("ZSGz");t.d(n,"default",(function(){return a["a"]}))},B68Z:function(e,n,t){"use strict";var a=t("0Owb"),r=t("PpiC"),l=t("k1fw"),o=t("q1tI"),c=t.n(o),i=t("1p7j"),d=(t("iCBh"),t("K3qG")),m=t("TSYQ"),s=t.n(m),u={large:18,small:14,mini:12},f=/.?(Outlined|Filled|TwoTone|Icon)$/;function g(e){return Object(d["h"])(e)?e.map((n,t)=>{var a,r,o,i=null===(a=n)||void 0===a?void 0:a.type,d="";i&&(d=(null===(r=i.render)||void 0===r?void 0:r.displayName)||(null===(o=i.render)||void 0===o?void 0:o.name)||i.name);if(d&&c.a.isValidElement(n)&&f.test(d)){var m={marginLeft:8,marginRight:8};0===t&&(m={marginRight:8}),t===e.length-1&&(m={marginLeft:8});var s=Object(l["a"])(Object(l["a"])({},n.props.style),m);return c.a.cloneElement(n,{style:s,key:t})}return n}):e}var v=e=>{var n=e.size,t=e.color,l=e.circle,d=e.outline,m=e.block,f=e.link,v=e.icon,h=e.disabled,E=e.loading,k=e.md,p=e.win,w=e.children,b=e.className,F=e.href,I=Object(r["a"])(e,["size","color","circle","outline","block","link","icon","disabled","loading","md","win","children","className","href"]),T=s()(b,"m78-btn","m78-effect",{["__".concat(t)]:t,["__".concat(n)]:n,__circle:l,__outline:d,__block:m,__link:f,__icon:v,__md:k,__win:p,__light:!!t&&!f&&!v,__disabled:h||E}),y=Object(o["useMemo"])(()=>g(w),[w]);return c.a.createElement("button",Object(a["a"])({type:"button"},I,{className:T,disabled:!!h||!!E}),f&&c.a.createElement("a",{className:"m78-btn__link",href:F}),c.a.createElement(i["default"],{style:{fontSize:n?u[n]:14,color:"#333"},show:!!E,full:!0,text:""}),c.a.createElement("span",null,y))};n["a"]=v},BO4J:function(e,n){},Ctpu:function(e,n,t){"use strict";t.d(n,"a",(function(){return u})),t.d(n,"b",(function(){return g})),t.d(n,"c",(function(){return f}));var a=t("k1fw"),r=t("q1tI"),l=t.n(r),o=t("1p7j"),c=t("K3qG"),i=t("uVtn"),d=t("t1JD"),m=t("efh2"),s=e=>{var n=e.children,t=e.send,r=e.loadingFull,s=e.loading,u=e.error,f=e.timeout,g=e.hasData,v=e.forceRenderChild,h=e.loadingStyle,E=e.emptyText,k=void 0===E?"\u6682\u65e0\u6570\u636e":E,p=()=>Object(c["k"])(n)?n():n;if(s)return l.a.createElement(l.a.Fragment,null,l.a.createElement(o["default"],{className:"ptb-12",style:Object(a["a"])({width:"100%"},h),full:r,loadingDelay:300}),(v||r)&&p());var w=t?l.a.createElement(i["default"],{onClick:t,color:"primary",link:!0,size:"small",style:{top:-1}},"\u70b9\u51fb\u91cd\u65b0\u52a0\u8f7d"):null;return u||f?l.a.createElement(d["a"],{status:"error",message:f?"\u8bf7\u6c42\u8d85\u65f6":"\u6570\u636e\u52a0\u8f7d\u5931\u8d25",desc:l.a.createElement("div",null,(null===u||void 0===u?void 0:u.message)&&l.a.createElement("div",{className:"color-error mb-8"},u.message),l.a.createElement("span",null,"\u8bf7\u7a0d\u540e\u91cd\u8bd5",t?"\u6216":null," "),w)}):g||s?p():l.a.createElement(m["default"],{desc:k},w)},u=e=>{var n=e.when,t=e.children;n=!!n;var a=Object(c["k"])(t);return n&&(a?t():t)},f=e=>{var n=e.when,t=e.children;function a(){return l.a.cloneElement(t,{style:{display:"none"}})}return n?t:a()},g=e=>{var n=e.children,t=l.a.Children.toArray(n),a=t.reduce((e,n)=>{if(n.type!==u&&n.type!==f)return e;var t="when"in n.props,a=!!n.props.when;return t||e.notWhen||(e.notWhen=l.a.cloneElement(n,{when:!0})),a&&!e.showEl&&(e.showEl=n),e},{showEl:null,notWhen:null});return a.showEl||a.notWhen||null};n["d"]=s},EALy:function(e,n,t){"use strict";t.r(n);var a=t("0Owb"),r=t("q1tI"),l=t.n(r),o=(t("B2uJ"),t("+su7"),t("qOys")),c=t.n(o),i=t("5Yjd"),d=t.n(i),m=l.a.memo((function(){var e=t("K+nK"),n=e(t("q1tI")),a=e(t("+PjD")),r=function(){return n["default"].createElement(a["default"],null)};return n["default"].createElement(r)})),s=l.a.memo((function(){var e=t("K+nK"),n=e(t("q1tI")),a=e(t("cmEn")),r=function(){return n["default"].createElement(a["default"],null)};return n["default"].createElement(r)})),u=l.a.memo((function(){var e=t("K+nK"),n=e(t("q1tI")),a=e(t("IDZi")),r=function(){return n["default"].createElement(a["default"],null)};return n["default"].createElement(r)})),f=l.a.memo((function(){var e=t("K+nK"),n=e(t("q1tI")),a=e(t("H2oi")),r=function(){return n["default"].createElement(a["default"],null)};return n["default"].createElement(r)}));n["default"]=function(){return l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{className:"markdown"},l.a.createElement("h1",{id:"fork-\u6761\u4ef6\u6e32\u67d3"},l.a.createElement("a",{"aria-hidden":"true",href:"#fork-\u6761\u4ef6\u6e32\u67d3"},l.a.createElement("span",{className:"icon icon-link"})),"Fork \u6761\u4ef6\u6e32\u67d3"),l.a.createElement("p",null,"\u7528\u4e8e\u89c4\u8303\u548c\u7b80\u5316\u67d0\u4e9b\u9700\u8981\u8fdb\u884c\u6761\u4ef6\u6e32\u67d3\u7684\u573a\u666f"),l.a.createElement("h2",{id:"fork"},l.a.createElement("a",{"aria-hidden":"true",href:"#fork"},l.a.createElement("span",{className:"icon icon-link"})),"Fork"),l.a.createElement("p",null,"\u4e00\u4e2a\u5904\u7406\u5f02\u6b65 UI \u7684\u7ec4\u4ef6"),l.a.createElement("p",null,"\u7ec4\u4ef6\u5047\u8bbe\u4e00\u4e2a\u5f02\u6b65 UI \u5305\u542b\u56db\u79cd\u72b6\u6001: ",l.a.createElement("code",null,"normal"),"(\u5e38\u6001 UI) | ",l.a.createElement("code",null,"loading")," | ",l.a.createElement("code",null,"timeout")," | ",l.a.createElement("code",null,"error")),l.a.createElement("p",null,"\u56db\u79cd\u72b6\u6001\u5e94\u8be5\u662f\u4e92\u65a5\u7684\uff0c\u53ea\u4f1a\u540c\u65f6\u751f\u6548\u4e00\u79cd(\u5f53 UI \u4e3a\u66f4\u65b0\u72b6\u6001\u65f6\uff0c\u53ef\u80fd\u4f1a\u9700\u8981 loading \u548c\u65e7\u6570\u636e\u4e00\u8d77\u663e\u793a, \u53ef\u4ee5\u901a\u8fc7",l.a.createElement("code",null,"forceRenderChild"),"\u542f\u7528)"),l.a.createElement("p",null,"\u72b6\u6001\u4f18\u5148\u7ea7\u5206\u522b\u662f: ",l.a.createElement("code",null,"loading")," > ",l.a.createElement("code",null,"timeout | error")," > ",l.a.createElement("code",null,"normal"))),l.a.createElement(d.a,Object(a["a"])({source:{tsx:"import React from 'react';\nimport Fork from 'm78/fork';\nimport { useFetch } from '@lxjx/hooks';\n\n// \u6a21\u62df\u4e00\u4e2a\u6210\u529f\u7387\u4e3a50%\u7684\u8bf7\u6c42\u63a5\u53e3\nconst mockData = () =>\n  new Promise((res, rej) => {\n    setTimeout(() => {\n      const rand = Math.random();\n\n      if (rand < 0.5) {\n        rej(new Error('\u52a0\u8f7d\u5f02\u5e38'));\n        return;\n      }\n\n      // \u6a21\u62df\u6709\u65e0\u6570\u636e\n      const data = Array.from({ length: Math.random() > 0.5 ? 0 : 8 }).map(() => Math.random());\n\n      res(data);\n    }, 1000);\n  });\n\nconst ForkDemo = () => {\n  const meta = useFetch<number[]>(mockData, {\n    timeout: Math.random() > 0.7 ? 500 : 8000, // \u6a21\u62df\u8d85\u65f6\u72b6\u6001\n  });\n\n  return (\n    <div>\n      <div className=\"mb-12\">\n        <button type=\"button\" disabled={meta.loading} onClick={meta.send}>\n          {meta.loading ? '\u52a0\u8f7d\u4e2d' : '\u53d1\u8d77\u8bf7\u6c42'}\n        </button>\n      </div>\n      <Fork hasData={meta.data && meta.data.length} {...meta}>\n        {() => (\n          <ul>\n            {meta.data!.map(item => (\n              <li key={item}>rand num: {item}</li>\n            ))}\n          </ul>\n        )}\n      </Fork>\n    </div>\n  );\n};\n\nexport default ForkDemo;\n",jsx:"import React from 'react';\nimport Fork from 'm78/fork';\nimport { useFetch } from '@lxjx/hooks'; // \u6a21\u62df\u4e00\u4e2a\u6210\u529f\u7387\u4e3a50%\u7684\u8bf7\u6c42\u63a5\u53e3\n\nconst mockData = () =>\n  new Promise((res, rej) => {\n    setTimeout(() => {\n      const rand = Math.random();\n\n      if (rand < 0.5) {\n        rej(new Error('\u52a0\u8f7d\u5f02\u5e38'));\n        return;\n      } // \u6a21\u62df\u6709\u65e0\u6570\u636e\n\n      const data = Array.from({\n        length: Math.random() > 0.5 ? 0 : 8,\n      }).map(() => Math.random());\n      res(data);\n    }, 1000);\n  });\n\nconst ForkDemo = () => {\n  const meta = useFetch(mockData, {\n    timeout: Math.random() > 0.7 ? 500 : 8000, // \u6a21\u62df\u8d85\u65f6\u72b6\u6001\n  });\n  return (\n    <div>\n      <div className=\"mb-12\">\n        <button type=\"button\" disabled={meta.loading} onClick={meta.send}>\n          {meta.loading ? '\u52a0\u8f7d\u4e2d' : '\u53d1\u8d77\u8bf7\u6c42'}\n        </button>\n      </div>\n      <Fork hasData={meta.data && meta.data.length} {...meta}>\n        {() => (\n          <ul>\n            {meta.data.map(item => (\n              <li key={item}>rand num: {item}</li>\n            ))}\n          </ul>\n        )}\n      </Fork>\n    </div>\n  );\n};\n\nexport default ForkDemo;\n"}},{path:"/_demos/fork-demo",dependencies:{"@lxjx/hooks":"1.4.0"},files:{}}),l.a.createElement(m,null)),l.a.createElement("div",{className:"markdown"},l.a.createElement("h2",{id:"if"},l.a.createElement("a",{"aria-hidden":"true",href:"#if"},l.a.createElement("span",{className:"icon icon-link"})),"If"),l.a.createElement("p",null,"\u6839\u636e\u6761\u4ef6\u6e32\u67d3\u6216\u5378\u8f7d\u5185\u90e8\u7684\u7ec4\u4ef6")),l.a.createElement(d.a,Object(a["a"])({source:{tsx:"import React from 'react';\nimport Fork from 'm78/fork';\n\nconst Demo = () => (\n  <div>\n    {/* eslint-disable-next-line */}\n    <Fork.If when={true}>\n      <div>\u4f60\u770b\u5230\u6211\u4e86 1</div>\n    </Fork.If>\n    <Fork.If when={false}>\n      <div>\u4f60\u770b\u4e0d\u5230\u6211 2</div>\n    </Fork.If>\n    <Fork.If when={0}>\n      <div>\u4f60\u770b\u4e0d\u5230\u6211 3</div>\n    </Fork.If>\n    <Fork.If when={123}>\n      <div>\u4f60\u770b\u5230\u6211\u4e86 4</div>\n    </Fork.If>\n    <Fork.If when>{() => <div>\u5ef6\u8fdf\u6e32\u67d3 5</div>}</Fork.If>\n  </div>\n);\n\nexport default Demo;\n",jsx:"import React from 'react';\nimport Fork from 'm78/fork';\n\nconst Demo = () => (\n  <div>\n    {/* eslint-disable-next-line */}\n    <Fork.If when>\n      <div>\u4f60\u770b\u5230\u6211\u4e86 1</div>\n    </Fork.If>\n    <Fork.If when={false}>\n      <div>\u4f60\u770b\u4e0d\u5230\u6211 2</div>\n    </Fork.If>\n    <Fork.If when={0}>\n      <div>\u4f60\u770b\u4e0d\u5230\u6211 3</div>\n    </Fork.If>\n    <Fork.If when={123}>\n      <div>\u4f60\u770b\u5230\u6211\u4e86 4</div>\n    </Fork.If>\n    <Fork.If when>{() => <div>\u5ef6\u8fdf\u6e32\u67d3 5</div>}</Fork.If>\n  </div>\n);\n\nexport default Demo;\n"}},{path:"/_demos/fork-demo-if",dependencies:{},files:{}}),l.a.createElement(s,null)),l.a.createElement("div",{className:"markdown"},l.a.createElement("h2",{id:"toggle"},l.a.createElement("a",{"aria-hidden":"true",href:"#toggle"},l.a.createElement("span",{className:"icon icon-link"})),"Toggle"),l.a.createElement("p",null,"\u663e\u793a\u6216\u9690\u85cf\u5185\u5bb9"),l.a.createElement("blockquote",null,l.a.createElement("p",null,"\u26a0 \u5fc5\u987b\u786e\u4fdd\u5b50\u53ea\u6709\u4e00\u4e2a\u5b50\u5143\u7d20\u5e76\u4e14\u5305\u542b\u5305\u88f9\u5143\u7d20\uff08\u5373\u4e0d\u80fd\u4e3a\u7eaf\u6587\u672c\uff09\uff0c\u7528\u4e8e\u6302\u8f7d display: 'none'"))),l.a.createElement(d.a,Object(a["a"])({source:{tsx:"import React from 'react';\nimport Fork from 'm78/fork';\n\nconst Demo = () => (\n  <div>\n    <Fork.Toggle when>\n      <div>\u4f60\u770b\u5230\u6211\u4e861</div>\n    </Fork.Toggle>\n    <Fork.Toggle when={false}>\n      <div>\u4f60\u770b\u4e0d\u5230\u62112</div>\n    </Fork.Toggle>\n    <Fork.Toggle when={0}>\n      <div>\u4f60\u770b\u4e0d\u5230\u62113</div>\n    </Fork.Toggle>\n    <Fork.Toggle when={123}>\n      <div>\u4f60\u770b\u5230\u6211\u4e864</div>\n    </Fork.Toggle>\n  </div>\n);\n\nexport default Demo;\n",jsx:"import React from 'react';\nimport Fork from 'm78/fork';\n\nconst Demo = () => (\n  <div>\n    <Fork.Toggle when>\n      <div>\u4f60\u770b\u5230\u6211\u4e861</div>\n    </Fork.Toggle>\n    <Fork.Toggle when={false}>\n      <div>\u4f60\u770b\u4e0d\u5230\u62112</div>\n    </Fork.Toggle>\n    <Fork.Toggle when={0}>\n      <div>\u4f60\u770b\u4e0d\u5230\u62113</div>\n    </Fork.Toggle>\n    <Fork.Toggle when={123}>\n      <div>\u4f60\u770b\u5230\u6211\u4e864</div>\n    </Fork.Toggle>\n  </div>\n);\n\nexport default Demo;\n"}},{path:"/_demos/fork-demo-toggle",dependencies:{},files:{}}),l.a.createElement(u,null)),l.a.createElement("div",{className:"markdown"},l.a.createElement("h2",{id:"switch"},l.a.createElement("a",{"aria-hidden":"true",href:"#switch"},l.a.createElement("span",{className:"icon icon-link"})),"Switch"),l.a.createElement("p",null,"\u642d\u914d If \u6216 Toggle \u4f7f\u7528\uff0c\u7c7b\u4f3c react-router \u7684 Switch\uff0c\u53ea\u6e32\u67d3\u5185\u90e8\u7684\u7b2c\u4e00\u4e2a prop.when \u4e3a true \u7684 If\uff0c\u5f53\u6ca1\u6709\u4efb\u4f55\u4e00\u4e2a If \u7684 when \u4e3a true \u65f6\uff0c\u5339\u914d\u7b2c\u4e00\u4e2a\u4e0d\u5305\u542b when \u7684 If")),l.a.createElement(d.a,Object(a["a"])({source:{tsx:"import React from 'react';\nimport Fork from 'm78/fork';\n\nconst Demo = () => (\n  <div>\n    <div className=\"color-second\">\u914d\u5408If</div>\n    <Fork.Switch>\n      <Fork.If when={false}>\n        <div>\u4f60\u770b\u4e0d\u5230\u62111</div>\n      </Fork.If>\n      <Fork.If when={false}>\n        <div>\u4f60\u770b\u4e0d\u5230\u62112</div>\n      </Fork.If>\n      <Fork.If>\n        <div>\u4f60\u770b\u5230\u6211\u4e863</div>\n      </Fork.If>\n    </Fork.Switch>\n\n    <div className=\"mt-32 color-second\">\u914d\u5408toggle</div>\n    <Fork.Switch>\n      <Fork.Toggle when={false}>\n        <div>\u4f60\u770b\u4e0d\u5230\u62111</div>\n      </Fork.Toggle>\n      <Fork.Toggle when={false}>\n        <div>\u4f60\u770b\u4e0d\u5230\u62112</div>\n      </Fork.Toggle>\n      <Fork.Toggle when={123123}>\n        <div>\u4f60\u770b\u5230\u6211\u4e863</div>\n      </Fork.Toggle>\n      <Fork.Toggle>\n        <div>\u4f60\u770b\u4e0d\u5230\u62114</div>\n      </Fork.Toggle>\n    </Fork.Switch>\n  </div>\n);\n\nexport default Demo;\n",jsx:"import React from 'react';\nimport Fork from 'm78/fork';\n\nconst Demo = () => (\n  <div>\n    <div className=\"color-second\">\u914d\u5408If</div>\n    <Fork.Switch>\n      <Fork.If when={false}>\n        <div>\u4f60\u770b\u4e0d\u5230\u62111</div>\n      </Fork.If>\n      <Fork.If when={false}>\n        <div>\u4f60\u770b\u4e0d\u5230\u62112</div>\n      </Fork.If>\n      <Fork.If>\n        <div>\u4f60\u770b\u5230\u6211\u4e863</div>\n      </Fork.If>\n    </Fork.Switch>\n\n    <div className=\"mt-32 color-second\">\u914d\u5408toggle</div>\n    <Fork.Switch>\n      <Fork.Toggle when={false}>\n        <div>\u4f60\u770b\u4e0d\u5230\u62111</div>\n      </Fork.Toggle>\n      <Fork.Toggle when={false}>\n        <div>\u4f60\u770b\u4e0d\u5230\u62112</div>\n      </Fork.Toggle>\n      <Fork.Toggle when={123123}>\n        <div>\u4f60\u770b\u5230\u6211\u4e863</div>\n      </Fork.Toggle>\n      <Fork.Toggle>\n        <div>\u4f60\u770b\u4e0d\u5230\u62114</div>\n      </Fork.Toggle>\n    </Fork.Switch>\n  </div>\n);\n\nexport default Demo;\n"}},{path:"/_demos/fork-demo-switch",dependencies:{},files:{}}),l.a.createElement(f,null)),l.a.createElement("div",{className:"markdown"},l.a.createElement("h2",{id:"props"},l.a.createElement("a",{"aria-hidden":"true",href:"#props"},l.a.createElement("span",{className:"icon icon-link"})),"props"),l.a.createElement("p",null,l.a.createElement("strong",null,l.a.createElement("code",null,"Fork"))),l.a.createElement(c.a,{code:"interface ForkProps {\n  /** \u662f\u5426\u6709\u6570\u636e\u7528\u4e8e\u663e\u793a, \u5f53\u4e3atruthy\u503c\u4e14\u65e0\u5176\u4ed6\u975e\u5e38\u89c4\u72b6\u6001\u65f6\u65f6\uff0c\u663e\u793a\u5b50\u5143\u7d20 */\n  hasData: any;\n  /** \u5f53\u6ca1\u6709\u4efb\u4f55\u975e\u5e38\u89c4\u72b6\u6001\u65f6\uff0c\u663e\u793a\u7684\u5185\u5bb9\uff0c\u5982\u679c\u5185\u5bb9\u4f9d\u8d56\u5176\u4ed6\u6570\u636e\uff0c\u53ef\u4ee5\u4f20\u5165\u51fd\u6570 */\n  children: React.ReactNode | (() => React.ReactNode);\n  /** \u662f\u5426\u5305\u542b\u9519\u8bef, \u5982\u679c\u662f\u4e00\u4e2a\u5bf9\u8c61\u4e14\u5305\u542bmessage\u5c5e\u6027\uff0c\u5219\u4f1a\u7528\u5176\u4f5c\u4e3a\u53cd\u9988\u663e\u793a */\n  error?: any;\n  /** \u662f\u5426\u8d85\u65f6 */\n  timeout?: boolean;\n  /** \u662f\u5426\u6b63\u5728\u8bf7\u6c42 */\n  loading?: boolean;\n  /** \u8bbe\u7f6e\u540e\uff0c\u5373\u4f7f\u5728loading\u4e2d\uff0c\u4e5f\u4f1a\u5f3a\u5236\u6e32\u67d3children */\n  forceRenderChild?: boolean;\n  /**\n   * \u9ed8\u8ba4loading\u4ee5\u5360\u4f4d\u8282\u70b9\u5f62\u5f0f\u663e\u793a\uff0c\u4f20\u5165\u6b64\u9879\u4f1a\u4f7f\u5176\u8131\u79bb\u6587\u6863\u6d41\u5e76\u586b\u6ee1\u7236\u5143\u7d20, \u9700\u8981\u7236\u5143\u7d20\u975e\u5e38\u89c4\u5b9a\u4f4d\u5143\u7d20(position\u975estatic)\n   * \u4f20\u5165\u6b64\u9879\u65f6\uff0c\u5373\u4f7f\u5728loading\u4e2d\uff0c\u4e5f\u4f1a\u5f3a\u5236\u6e32\u67d3\u5f3a\u5236\u6e32\u67d3children\n   * */\n  loadingFull?: boolean;\n  /** \u52a0\u8f7d\u63d0\u793a\u6587\u672c */\n  loadingText?: React.ReactNode;\n  /** \u7ed9loading node\u8bbe\u7f6estyle */\n  loadingStyle?: React.CSSProperties;\n  /** \u5f53\u5305\u542b\u5f02\u5e38\u65f6(error | timeout), \u901a\u8fc7\u6b64\u65b9\u6cd5\u8ba9\u7528\u6237\u8fdb\u884c\u66f4\u65b0\u8bf7\u6c42, \u4f20\u5165\u540e\u4f1a\u5728\u9519\u8bef\u548c\u65e0\u6570\u636e\u65f6\u663e\u793a\u91cd\u65b0\u52a0\u8f7d\u6309\u94ae */\n  send?: AnyFunction;\n  /** '\u6682\u65e0\u6570\u636e' | \u7a7a\u63d0\u793a\u6587\u672c */\n  emptyText?: React.ReactNode;\n}\n",lang:"tsx"}),l.a.createElement("p",null,l.a.createElement("strong",null,l.a.createElement("code",null,"If"))),l.a.createElement(c.a,{code:"interface IfProps {\n  /** \u4efb\u4f55falsy\\truthy\u503c */\n  when?: any;\n  /** \u5f85\u5207\u6362\u7684\u5b50\u5143\u7d20 */\n  children?: React.ReactNode;\n}\n",lang:"tsx"}),l.a.createElement("p",null,l.a.createElement("strong",null,l.a.createElement("code",null,"Toggle"))),l.a.createElement(c.a,{code:"interface ToggleProps {\n  /** \u4efb\u4f55falsy\\truthy\u503c */\n  when?: any;\n  /** \u5f85\u5207\u6362\u7684\u5b50\u5143\u7d20 */\n  children: React.ReactElement;\n}\n",lang:"tsx"}),l.a.createElement("p",null,l.a.createElement("strong",null,l.a.createElement("code",null,"Switch"))),l.a.createElement(c.a,{code:"interface SwitchProps {\n  children: React.ReactElement[];\n}\n",lang:"tsx"})))}},GTID:function(e,n,t){"use strict";t("iCBh"),t("pF+1")},H2oi:function(e,n,t){"use strict";t.r(n);var a=t("q1tI"),r=t.n(a),l=t("kr9X"),o=()=>r.a.createElement("div",null,r.a.createElement("div",{className:"color-second"},"\u914d\u5408If"),r.a.createElement(l["default"].Switch,null,r.a.createElement(l["default"].If,{when:!1},r.a.createElement("div",null,"\u4f60\u770b\u4e0d\u5230\u62111")),r.a.createElement(l["default"].If,{when:!1},r.a.createElement("div",null,"\u4f60\u770b\u4e0d\u5230\u62112")),r.a.createElement(l["default"].If,null,r.a.createElement("div",null,"\u4f60\u770b\u5230\u6211\u4e863"))),r.a.createElement("div",{className:"mt-32 color-second"},"\u914d\u5408toggle"),r.a.createElement(l["default"].Switch,null,r.a.createElement(l["default"].Toggle,{when:!1},r.a.createElement("div",null,"\u4f60\u770b\u4e0d\u5230\u62111")),r.a.createElement(l["default"].Toggle,{when:!1},r.a.createElement("div",null,"\u4f60\u770b\u4e0d\u5230\u62112")),r.a.createElement(l["default"].Toggle,{when:123123},r.a.createElement("div",null,"\u4f60\u770b\u5230\u6211\u4e863")),r.a.createElement(l["default"].Toggle,null,r.a.createElement("div",null,"\u4f60\u770b\u4e0d\u5230\u62114"))));n["default"]=o},IDZi:function(e,n,t){"use strict";t.r(n);var a=t("q1tI"),r=t.n(a),l=t("kr9X"),o=()=>r.a.createElement("div",null,r.a.createElement(l["default"].Toggle,{when:!0},r.a.createElement("div",null,"\u4f60\u770b\u5230\u6211\u4e861")),r.a.createElement(l["default"].Toggle,{when:!1},r.a.createElement("div",null,"\u4f60\u770b\u4e0d\u5230\u62112")),r.a.createElement(l["default"].Toggle,{when:0},r.a.createElement("div",null,"\u4f60\u770b\u4e0d\u5230\u62113")),r.a.createElement(l["default"].Toggle,{when:123},r.a.createElement("div",null,"\u4f60\u770b\u5230\u6211\u4e864")));n["default"]=o},Jiyh:function(e,n){},"K+nK":function(e,n){function t(e){return e&&e.__esModule?e:{default:e}}e.exports=t},LUSG:function(e,n,t){"use strict";t.d(n,"a",(function(){return o}));var a=t("tJVT"),r=t("q1tI"),l=t("lgaZ");function o(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:300,t=arguments.length>2?arguments[2]:void 0,o=t||{},c=o.disabled,i=o.deps,d=void 0===i?[]:i,m=o.extraDelay,s=void 0===m?0:m,u=o.trailing,f=o.leading,g=void 0===f||f,v=!n||c||!u&&!g,h=Object(r["useState"])(!(!v&&g)&&e),E=Object(a["a"])(h,2),k=E[0],p=E[1],w=Object(l["j"])({toggleTimer:null});return Object(r["useEffect"])(()=>{if(!v&&e!==k){if((!e||g)&&(e||u))return w.toggleTimer=setTimeout(()=>{p(e)},n+s),()=>{w.toggleTimer&&clearTimeout(w.toggleTimer)};p(e)}},[e,...d]),v?e:k}},O60i:function(e,n,t){"use strict";var a=t("q1tI"),r=t.n(a),l=r.a.createContext({});function o(){return Object(a["useContext"])(l)}n["a"]={context:l,Provider:l.Provider,Consumer:l.Consumer,useConfig:o}},QjBK:function(e,n,t){"use strict";t("iCBh"),t("tU1D")},TcRa:function(e,n){},WwnQ:function(e,n,t){},ZSGz:function(e,n,t){"use strict";var a=t("0Owb"),r=t("PpiC"),l=t("q1tI"),o=t.n(l),c=t("Rz6r"),i=t("LUSG"),d=t("9RZ+"),m=t("TSYQ"),s=t.n(m),u=e=>{var n=e.size,t=e.inline,l=e.text,m=void 0===l?"\u52a0\u8f7d\u4e2d":l,u=e.full,f=e.dark,g=e.show,v=void 0===g||g,h=e.className,E=e.loadingDelay,k=void 0===E?0:E,p=Object(r["a"])(e,["size","inline","text","full","dark","show","className","loadingDelay"]),w=Object(i["a"])(v,k);return o.a.createElement(d["a"],Object(a["a"])({toggle:w,type:"fade",mountOnEnter:!0,unmountOnExit:!0},p,{config:d["c"].stiff,className:s()(h,"m78-spin",{["__".concat(n)]:!!n,__inline:t,__full:u,__dark:f})}),o.a.createElement(c["WindmillIcon"],{className:"m78-spin_unit"}),m&&o.a.createElement("span",{className:"m78-spin_text"},m,o.a.createElement("span",{className:"m78-spin_ellipsis"})))};n["a"]=u},bf2K:function(e,n){},bgvL:function(e,n,t){},cDKg:function(e,n,t){"use strict";t("iCBh"),t("bgvL")},cmEn:function(e,n,t){"use strict";t.r(n);var a=t("q1tI"),r=t.n(a),l=t("kr9X"),o=()=>r.a.createElement("div",null,r.a.createElement(l["default"].If,{when:!0},r.a.createElement("div",null,"\u4f60\u770b\u5230\u6211\u4e86 1")),r.a.createElement(l["default"].If,{when:!1},r.a.createElement("div",null,"\u4f60\u770b\u4e0d\u5230\u6211 2")),r.a.createElement(l["default"].If,{when:0},r.a.createElement("div",null,"\u4f60\u770b\u4e0d\u5230\u6211 3")),r.a.createElement(l["default"].If,{when:123},r.a.createElement("div",null,"\u4f60\u770b\u5230\u6211\u4e86 4")),r.a.createElement(l["default"].If,{when:!0},()=>r.a.createElement("div",null,"\u5ef6\u8fdf\u6e32\u67d3 5")));n["default"]=o},eTaW:function(e,n,t){"use strict";var a=t("0Owb"),r=t("PpiC"),l=t("q1tI"),o=t.n(l),c=t("Rz6r"),i=t("O60i"),d=t("TSYQ"),m=t.n(d);function s(e){return e?o.a.cloneElement(e,{className:m()("m78-empty_icon",e.props.className)}):null}var u=e=>{var n=e.desc,t=e.children,l=e.size,d=e.emptyNode,u=Object(r["a"])(e,["desc","children","size","emptyNode"]),f=i["a"].useConfig(),g=f.emptyNode;return o.a.createElement("div",Object(a["a"])({className:m()("m78-empty",l&&"__".concat(l),u.className)},u),s(d)||s(g)||o.a.createElement(c["EmptyIcon"],{className:"m78-empty_icon"}),o.a.createElement("div",{className:"m78-empty_desc"},n),o.a.createElement("div",{className:"m78-empty_actions"},t))};n["a"]=u},efh2:function(e,n,t){"use strict";t("lCdt");var a=t("eTaW");t("bf2K");n["default"]=a["a"]},jNhd:function(e,n,t){"use strict";var a=t("q1tI"),r=t("bdgK"),l=function(){var e=Object(a["useState"])({x:0,y:0,width:0,height:0,top:0,left:0,bottom:0,right:0}),n=e[0],t=e[1],l=Object(a["useState"])((function(){return new r["a"]((function(e){var n=e[0];n&&t(n.contentRect)}))}))[0],o=Object(a["useCallback"])((function(e){l.disconnect(),e&&l.observe(e)}),[l]);return[o,n]};n["a"]=l},kr9X:function(e,n,t){"use strict";t("cDKg");var a=t("Ctpu"),r=t("Jiyh");t.o(r,"If")&&t.d(n,"If",(function(){return r["If"]})),t.o(r,"Switch")&&t.d(n,"Switch",(function(){return r["Switch"]})),t.o(r,"Toggle")&&t.d(n,"Toggle",(function(){return r["Toggle"]})),t.d(n,"If",(function(){return a["a"]})),t.d(n,"Switch",(function(){return a["b"]})),t.d(n,"Toggle",(function(){return a["c"]}));var l=a["d"];l.If=a["a"],l.Toggle=a["c"],l.Switch=a["b"],n["default"]=l},lCdt:function(e,n,t){"use strict";t("iCBh"),t("WwnQ")},"pF+1":function(e,n,t){},rbUi:function(e,n,t){},t1JD:function(e,n,t){"use strict";t.d(n,"a",(function(){return k}));t("iCBh"),t("rbUi");var a=t("k1fw"),r=t("tJVT"),l=t("PpiC"),o=t("q1tI"),c=t.n(o),i=t("jNhd"),d=t("hEdC"),m=t("wEEd"),s=t("lgaZ"),u=t("Rz6r"),f=t("kr9X"),g=t("uVtn"),v=t("TSYQ"),h=t.n(v),E=e=>{var n=e.closable,t=void 0===n||n,o=e.desc,v=e.message,E=e.status,k=e.fixedTop,p=e.right,w=Object(l["a"])(e,["closable","desc","message","status","fixedTop","right"]),b=Object(i["a"])(),F=Object(r["a"])(b,2),I=F[0],T=F[1].height,y=Object(s["f"])(w,!0,{valueKey:"show",triggerKey:"onClose"}),j=Object(r["a"])(y,2),N=j[0],_=j[1],O=Object(m["d"])(()=>({height:"auto",config:Object(a["a"])(Object(a["a"])({},m["b"].stiff),{},{clamp:!0})})),x=Object(r["a"])(O,2),D=x[0],S=x[1];Object(d["a"])(()=>{S({height:N?T+36:0})},[N,T]);var R=u["lineStatusIcons"][E];return c.a.createElement(m["a"].div,{style:D,className:h()("m78-notice-bar",E&&"__".concat(E),{__fixed:k})},c.a.createElement("div",{ref:I,className:"m78-notice-bar_wrap"},c.a.createElement(f["If"],{when:E},()=>c.a.createElement("div",{className:"m78-notice-bar_left"},c.a.createElement(R,null))),c.a.createElement("div",{className:"m78-notice-bar_cont"},c.a.createElement("div",{className:"m78-notice-bar_title ellipsis"},v),c.a.createElement(f["If"],{when:o},c.a.createElement("div",{className:"m78-notice-bar_desc"},o))),c.a.createElement("div",{className:"m78-notice-bar_right"},p,c.a.createElement(f["If"],{when:t&&!p},c.a.createElement(g["default"],{className:"m78-notice-bar_close",icon:!0,size:"mini",onClick:()=>{_(!1)}},c.a.createElement(u["CloseOutlined"],null))))))},k=E},tU1D:function(e,n,t){},uVtn:function(e,n,t){"use strict";t("QjBK"),t("BO4J");var a=t("B68Z");t.d(n,"default",(function(){return a["a"]}))}}]);