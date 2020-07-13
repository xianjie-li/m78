// @ts-nocheck
import { ApplyPluginsType, dynamic } from 'C:/Users/lee/Desktop/fr/node_modules/@umijs/runtime';
import { plugin } from './plugin';

const routes = [
  {
    "path": "/_demos/button-demo-color",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__base__button__button-demo-color' */'..\\..\\docs\\base\\button\\button-demo-color.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/button-demo-disabled",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__base__button__button-demo-disabled' */'..\\..\\docs\\base\\button\\button-demo-disabled.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/button-demo-size",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__base__button__button-demo-size' */'..\\..\\docs\\base\\button\\button-demo-size.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/button-demo-circle",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__base__button__button-demo-circle' */'..\\..\\docs\\base\\button\\button-demo-circle.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/button-demo-outline",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__base__button__button-demo-outline' */'..\\..\\docs\\base\\button\\button-demo-outline.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/button-demo-loading",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__base__button__button-demo-loading' */'..\\..\\docs\\base\\button\\button-demo-loading.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/button-demo-block",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__base__button__button-demo-block' */'..\\..\\docs\\base\\button\\button-demo-block.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/button-demo-link",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__base__button__button-demo-link' */'..\\..\\docs\\base\\button\\button-demo-link.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/button-demo-icon",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__base__button__button-demo-icon' */'..\\..\\docs\\base\\button\\button-demo-icon.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/button-demo-effect",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__base__button__button-demo-effect' */'..\\..\\docs\\base\\button\\button-demo-effect.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__base__ellipsis__demo' */'..\\..\\docs\\base\\ellipsis\\demo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/icon-demo",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__base__icon__icon-demo' */'..\\..\\docs\\base\\icon\\icon-demo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/icon-demo3",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__base__icon__icon-demo3' */'..\\..\\docs\\base\\icon\\icon-demo3.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/spin-demo",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__base__spin__spin-demo' */'..\\..\\docs\\base\\spin\\spin-demo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/spin-demo2",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__base__spin__spin-demo2' */'..\\..\\docs\\base\\spin\\spin-demo2.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/spin-demo-custom-text",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__base__spin__spin-demo-custom-text' */'..\\..\\docs\\base\\spin\\spin-demo-custom-text.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/spin-demo-full",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__base__spin__spin-demo-full' */'..\\..\\docs\\base\\spin\\spin-demo-full.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-1",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__action-sheet__demo' */'..\\..\\docs\\feedback\\action-sheet\\demo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-api",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__action-sheet__demo-api' */'..\\..\\docs\\feedback\\action-sheet\\demo-api.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-2",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__anotice-bar__demo' */'..\\..\\docs\\feedback\\anotice-bar\\demo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-3",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__drawer__demo' */'..\\..\\docs\\feedback\\drawer\\demo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-4",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__empty__demo' */'..\\..\\docs\\feedback\\empty\\demo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-config",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__empty__demo-config' */'..\\..\\docs\\feedback\\empty\\demo-config.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/message-demo",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__message__message-demo' */'..\\..\\docs\\feedback\\message\\message-demo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/message-demo2",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__message__message-demo2' */'..\\..\\docs\\feedback\\message\\message-demo2.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-5",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__modal__demo' */'..\\..\\docs\\feedback\\modal\\demo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-api-1",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__modal__demo-api' */'..\\..\\docs\\feedback\\modal\\demo-api.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-custom",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__modal__demo-custom' */'..\\..\\docs\\feedback\\modal\\demo-custom.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-6",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__popper__demo' */'..\\..\\docs\\feedback\\popper\\demo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo2",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__popper__demo2' */'..\\..\\docs\\feedback\\popper\\demo2.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo3",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__popper__demo3' */'..\\..\\docs\\feedback\\popper\\demo3.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo4",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__popper__demo4' */'..\\..\\docs\\feedback\\popper\\demo4.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-7",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__result__demo' */'..\\..\\docs\\feedback\\result\\demo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-8",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__skeleton__demo' */'..\\..\\docs\\feedback\\skeleton\\demo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-9",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__check__demo' */'..\\..\\docs\\form\\check\\demo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/custom",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__check__custom' */'..\\..\\docs\\form\\check\\custom.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/use-check-demo",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__check__useCheckDemo' */'..\\..\\docs\\form\\check\\useCheckDemo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-10",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__check-box__demo' */'..\\..\\docs\\form\\check-box\\demo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/base",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__form__base' */'..\\..\\docs\\form\\form\\base.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/linkage",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__form__linkage' */'..\\..\\docs\\form\\form\\linkage.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/embedded",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__form__embedded' */'..\\..\\docs\\form\\form\\embedded.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/list",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__form__list' */'..\\..\\docs\\form\\form\\list.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/validate",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__form__validate' */'..\\..\\docs\\form\\form\\validate.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/validate2",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__form__validate2' */'..\\..\\docs\\form\\form\\validate2.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/layout",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__form__layout' */'..\\..\\docs\\form\\form\\layout.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-11",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__input__demo' */'..\\..\\docs\\form\\input\\demo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-format",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__input__demo-format' */'..\\..\\docs\\form\\input\\demo-format.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-format-parser",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__input__demo-format-parser' */'..\\..\\docs\\form\\input\\demo-format-parser.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-format-textarea",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__input__demo-format-textarea' */'..\\..\\docs\\form\\input\\demo-format-textarea.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-12",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__radio-box__demo' */'..\\..\\docs\\form\\radio-box\\demo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-13",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__select__demo' */'..\\..\\docs\\form\\select\\demo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/multiple",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__select__multiple' */'..\\..\\docs\\form\\select\\multiple.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/search",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__select__search' */'..\\..\\docs\\form\\select\\search.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/big-data",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__select__big-data' */'..\\..\\docs\\form\\select\\big-data.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/custom-tag",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__select__custom-tag' */'..\\..\\docs\\form\\select\\custom-tag.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/custom-toolbar",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__select__custom-toolbar' */'..\\..\\docs\\form\\select\\custom-toolbar.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-14",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__integration__scroll__demo' */'..\\..\\docs\\integration\\scroll\\demo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/fork-demo-if",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__utils__fork__fork-demo-if' */'..\\..\\docs\\utils\\fork\\fork-demo-if.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/fork-demo-toggle",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__utils__fork__fork-demo-toggle' */'..\\..\\docs\\utils\\fork\\fork-demo-toggle.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/fork-demo-switch",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__utils__fork__fork-demo-switch' */'..\\..\\docs\\utils\\fork\\fork-demo-switch.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-15",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__utils__mask__demo' */'..\\..\\docs\\utils\\mask\\demo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-16",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__utils__show-from-mouse__demo' */'..\\..\\docs\\utils\\show-from-mouse\\demo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/article-box-demo",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__article-box__article-box-demo' */'..\\..\\docs\\view\\article-box\\article-box-demo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/carousel-demo",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__carousel__carousel-demo' */'..\\..\\docs\\view\\carousel\\carousel-demo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/carousel-vertical",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__carousel__carousel-vertical' */'..\\..\\docs\\view\\carousel\\carousel-vertical.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/carousel-manual",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__carousel__carousel-manual' */'..\\..\\docs\\view\\carousel\\carousel-manual.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/count-down-demo",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__count-down__count-down-demo' */'..\\..\\docs\\view\\count-down\\count-down-demo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/count-down-format",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__count-down__count-down-format' */'..\\..\\docs\\view\\count-down\\count-down-format.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-17",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__image-preview__demo' */'..\\..\\docs\\view\\image-preview\\demo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-api-2",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__image-preview__demo-api' */'..\\..\\docs\\view\\image-preview\\demo-api.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-list",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__image-preview__demo-list' */'..\\..\\docs\\view\\image-preview\\demo-list.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-18",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__list__demo' */'..\\..\\docs\\view\\list\\demo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-form",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__list__demo-form' */'..\\..\\docs\\view\\list\\demo-form.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-19",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__picture__demo' */'..\\..\\docs\\view\\picture\\demo.tsx')}),
    "exact": true
  },
  {
    "path": "/_demos/demo-20",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__viewer__demo' */'..\\..\\docs\\view\\viewer\\demo.tsx')}),
    "exact": true
  },
  {
    "path": "/",
    "component": (props) => require('react').createElement(require('../../../node_modules/@umijs/preset-dumi/lib/themes/default/layout.js').default, {
      ...{"menus":{"*":{"*":[{"path":"/","title":"README","meta":{"order":null}}],"/docs":[{"path":"/docs","title":"快速上手","meta":{"order":1}},{"title":"基础组件","path":"/docs/base","meta":{"order":1000},"children":[{"path":"/docs/base/button","title":"Button - 按钮","meta":{}},{"path":"/docs/base/ellipsis","title":"Ellipsis - 超出隐藏","meta":{}},{"path":"/docs/base/icon","title":"Icon - 图标","meta":{}},{"path":"/docs/base/spin","title":"Spin - 加载中","meta":{}}]},{"title":"反馈","path":"/docs/feedback","meta":{"order":2000},"children":[{"path":"/docs/feedback/action-sheet","title":"ActionSheet - 操作面板","meta":{}},{"path":"/docs/feedback/drawer","title":"Drawer - 抽屉","meta":{}},{"path":"/docs/feedback/empty","title":"Empty - 空状态","meta":{}},{"path":"/docs/feedback/message","title":"Message - 消息提醒","meta":{}},{"path":"/docs/feedback/modal","title":"Modal - 对话框","meta":{}},{"path":"/docs/feedback/notice-bar","title":"NoticeBar - 提示条","meta":{}},{"path":"/docs/feedback/popper","title":"Popper - 气泡框","meta":{}},{"path":"/docs/feedback/result","title":"Result - 结果","meta":{}},{"path":"/docs/feedback/skeleton","title":"Skeleton - 骨架","meta":{}}]},{"title":"数据录入","path":"/docs/form","meta":{"order":3000},"children":[{"path":"/docs/form/check","title":"Check - 选择框","meta":{}},{"path":"/docs/form/check-box","title":"CheckBox - 多选","meta":{}},{"path":"/docs/form/form","title":"Form - 表单","meta":{}},{"path":"/docs/form/input","title":"Input - 输入框","meta":{}},{"path":"/docs/form/radio-box","title":"RadioBox - 单选","meta":{}},{"path":"/docs/form/select","title":"Select - 选择器","meta":{}}]},{"title":"集成组件","path":"/docs/integration","meta":{"order":4000},"children":[{"path":"/docs/integration/scroll","title":"Scroll - 滚动","meta":{}}]},{"title":"展示组件","path":"/docs/view","meta":{"order":4000},"children":[{"path":"/docs/view/article-box","title":"ArticleBox - 富文本盒子","meta":{}},{"path":"/docs/view/carousel","title":"Carousel - 轮播","meta":{}},{"path":"/docs/view/count-down","title":"CountDown - 倒计时","meta":{}},{"path":"/docs/view/image-preview","title":"ImagePreview - 图片浏览","meta":{}},{"path":"/docs/view/list","title":"List - 列表","meta":{}},{"path":"/docs/view/picture","title":"Picture - 图片","meta":{}},{"path":"/docs/view/viewer","title":"Viewer - 查看器","meta":{}}]},{"title":"工具","path":"/docs/utils","meta":{"order":5000},"children":[{"path":"/docs/utils/fork","title":"Fork - 条件渲染","meta":{}},{"path":"/docs/utils/mask","title":"Mask - 遮罩","meta":{}},{"path":"/docs/utils/portal","title":"Portal - 传送门","meta":{}},{"path":"/docs/utils/show-from-mouse","title":"ShowFromMouse - 遮罩2","meta":{}}]},{"title":"其他","path":"/docs/FAQ","meta":{"order":10000},"children":[{"path":"/docs/FAQ/faq","title":"FAQ - 常见问题","meta":{}},{"path":"/docs/FAQ/rules","title":"约定","meta":{}}]}]}},"locales":[],"navs":{"*":[{"path":"/docs","title":"Docs"},{"title":"hooks","path":"https://iixianjie.github.io/hooks/"},{"title":"github","path":"https://github.com/Iixianjie/fr"}]},"title":"fr","logo":"/logo.png","desc":"components, hooks, utils, part of the react toolchain","mode":"site"},
      ...props,
    }),
    "routes": [
      {
        "path": "/",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'README.md' */'../../../README.md')}),
        "exact": true,
        "meta": {
          "locale": "zh-CN",
          "title": "README",
          "order": null
        },
        "title": "README"
      },
      {
        "path": "/docs/FAQ/faq",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__FAQ.md' */'../../docs/FAQ.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/FAQ.md",
          "updatedTime": 1593476106000,
          "title": "FAQ - 常见问题",
          "group": {
            "title": "其他",
            "path": "/docs/FAQ",
            "order": 10000
          },
          "slugs": [],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "FAQ - 常见问题"
      },
      {
        "path": "/docs",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__index.md' */'../../docs/index.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/index.md",
          "updatedTime": 1593856545000,
          "title": "快速上手",
          "order": 1,
          "slugs": [
            {
              "depth": 2,
              "value": "🎉Introduction",
              "heading": "introduction"
            },
            {
              "depth": 2,
              "value": "✨Features",
              "heading": "features"
            },
            {
              "depth": 2,
              "value": "📦Install",
              "heading": "install"
            },
            {
              "depth": 2,
              "value": "🍭Usage",
              "heading": "usage"
            },
            {
              "depth": 2,
              "value": "按需加载",
              "heading": "按需加载"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "快速上手"
      },
      {
        "path": "/docs/FAQ/rules",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__rules.md' */'../../docs/rules.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/rules.md",
          "updatedTime": 1593476106000,
          "title": "约定",
          "group": {
            "title": "其他",
            "path": "/docs/FAQ",
            "order": 10000
          },
          "slugs": [
            {
              "depth": 2,
              "value": "样式",
              "heading": "样式"
            },
            {
              "depth": 2,
              "value": "组件约定",
              "heading": "组件约定"
            },
            {
              "depth": 2,
              "value": "项目组织",
              "heading": "项目组织"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "约定"
      },
      {
        "path": "/docs/base/button",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__base__button__button.md' */'../../docs/base/button/button.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/base/button/button.md",
          "updatedTime": 1584790603000,
          "title": "Button - 按钮",
          "group": {
            "title": "基础组件",
            "path": "/docs/base",
            "order": 1000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Button 按钮",
              "heading": "button-按钮"
            },
            {
              "depth": 2,
              "value": "颜色",
              "heading": "颜色"
            },
            {
              "depth": 2,
              "value": "禁用",
              "heading": "禁用"
            },
            {
              "depth": 2,
              "value": "尺寸",
              "heading": "尺寸"
            },
            {
              "depth": 2,
              "value": "圆形按钮",
              "heading": "圆形按钮"
            },
            {
              "depth": 2,
              "value": "透明 + 边框",
              "heading": "透明--边框"
            },
            {
              "depth": 2,
              "value": "加载中",
              "heading": "加载中"
            },
            {
              "depth": 2,
              "value": "块级按钮",
              "heading": "块级按钮"
            },
            {
              "depth": 2,
              "value": "链接按钮",
              "heading": "链接按钮"
            },
            {
              "depth": 2,
              "value": "图标按钮",
              "heading": "图标按钮"
            },
            {
              "depth": 2,
              "value": "交互效果",
              "heading": "交互效果"
            },
            {
              "depth": 2,
              "value": "props",
              "heading": "props"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Button - 按钮"
      },
      {
        "path": "/docs/base/ellipsis",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__base__ellipsis__ellipsis.md' */'../../docs/base/ellipsis/ellipsis.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/base/ellipsis/ellipsis.md",
          "updatedTime": 1584790603000,
          "title": "Ellipsis - 超出隐藏",
          "group": {
            "title": "展示组件",
            "path": "/docs/base",
            "order": 1000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Ellipsis 超出隐藏",
              "heading": "ellipsis-超出隐藏"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Ellipsis - 超出隐藏"
      },
      {
        "path": "/docs/base/icon",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__base__icon__icon.md' */'../../docs/base/icon/icon.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/base/icon/icon.md",
          "updatedTime": 1589912978000,
          "title": "Icon - 图标",
          "group": {
            "title": "基础组件",
            "path": "/docs/base",
            "order": 1000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Icon 图标",
              "heading": "icon-图标"
            },
            {
              "depth": 2,
              "value": "代码示例",
              "heading": "代码示例"
            },
            {
              "depth": 2,
              "value": "内置图标",
              "heading": "内置图标"
            },
            {
              "depth": 2,
              "value": "props",
              "heading": "props"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Icon - 图标"
      },
      {
        "path": "/docs/base/spin",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__base__spin__spin.md' */'../../docs/base/spin/spin.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/base/spin/spin.md",
          "updatedTime": 1590972333000,
          "title": "Spin - 加载中",
          "group": {
            "title": "基础组件",
            "path": "/docs/base",
            "order": 1000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Icon 图标",
              "heading": "icon-图标"
            },
            {
              "depth": 2,
              "value": "基本用法",
              "heading": "基本用法"
            },
            {
              "depth": 2,
              "value": "内联",
              "heading": "内联"
            },
            {
              "depth": 2,
              "value": "自定义文本",
              "heading": "自定义文本"
            },
            {
              "depth": 2,
              "value": "填满容器",
              "heading": "填满容器"
            },
            {
              "depth": 2,
              "value": "props",
              "heading": "props"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Spin - 加载中"
      },
      {
        "path": "/docs/feedback/action-sheet",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__action-sheet__action-sheet.md' */'../../docs/feedback/action-sheet/action-sheet.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/feedback/action-sheet/action-sheet.md",
          "updatedTime": 1584790603000,
          "title": "ActionSheet - 操作面板",
          "group": {
            "title": "反馈",
            "path": "/docs/feedback",
            "order": 2000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "ActionSheet 操作面板",
              "heading": "actionsheet-操作面板"
            },
            {
              "depth": 2,
              "value": "基础示例",
              "heading": "基础示例"
            },
            {
              "depth": 2,
              "value": "通过 api 调用",
              "heading": "通过-api-调用"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "ActionSheet - 操作面板"
      },
      {
        "path": "/docs/feedback/notice-bar",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__anotice-bar__notice-bar.md' */'../../docs/feedback/anotice-bar/notice-bar.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/feedback/anotice-bar/notice-bar.md",
          "updatedTime": 1584790603000,
          "title": "NoticeBar - 提示条",
          "group": {
            "title": "反馈",
            "path": "/docs/feedback",
            "order": 2000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "NoticeBar 提示条",
              "heading": "noticebar-提示条"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "NoticeBar - 提示条"
      },
      {
        "path": "/docs/feedback/drawer",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__drawer__drawer.md' */'../../docs/feedback/drawer/drawer.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/feedback/drawer/drawer.md",
          "updatedTime": 1584790603000,
          "title": "Drawer - 抽屉",
          "group": {
            "title": "反馈",
            "path": "/docs/feedback",
            "order": 2000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Drawer 抽屉",
              "heading": "drawer-抽屉"
            },
            {
              "depth": 2,
              "value": "基础示例",
              "heading": "基础示例"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Drawer - 抽屉"
      },
      {
        "path": "/docs/feedback/empty",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__empty__empty.md' */'../../docs/feedback/empty/empty.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/feedback/empty/empty.md",
          "updatedTime": 1584887369000,
          "title": "Empty - 空状态",
          "group": {
            "title": "展示组件",
            "path": "/docs/feedback",
            "order": 2000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Empty 空状态",
              "heading": "empty-空状态"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "全局配置",
              "heading": "全局配置"
            },
            {
              "depth": 2,
              "value": "props",
              "heading": "props"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Empty - 空状态"
      },
      {
        "path": "/docs/feedback/message",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__message__message.md' */'../../docs/feedback/message/message.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/feedback/message/message.md",
          "updatedTime": 1593476106000,
          "title": "Message - 消息提醒",
          "group": {
            "title": "反馈",
            "path": "/docs/feedback",
            "order": 2000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Message 消息提醒",
              "heading": "message-消息提醒"
            },
            {
              "depth": 2,
              "value": "基础示例",
              "heading": "基础示例"
            },
            {
              "depth": 2,
              "value": "底层 api",
              "heading": "底层-api"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Message - 消息提醒"
      },
      {
        "path": "/docs/feedback/modal",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__modal__modal.md' */'../../docs/feedback/modal/modal.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/feedback/modal/modal.md",
          "updatedTime": 1584887369000,
          "title": "Modal - 对话框",
          "group": {
            "title": "反馈",
            "path": "/docs/feedback",
            "order": 2000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Modal 对话框",
              "heading": "modal-对话框"
            },
            {
              "depth": 2,
              "value": "基础示例",
              "heading": "基础示例"
            },
            {
              "depth": 2,
              "value": "通过 api 使用",
              "heading": "通过-api-使用"
            },
            {
              "depth": 2,
              "value": "完全定制",
              "heading": "完全定制"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Modal - 对话框"
      },
      {
        "path": "/docs/feedback/popper",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__popper__popper.md' */'../../docs/feedback/popper/popper.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/feedback/popper/popper.md",
          "updatedTime": 1589390820000,
          "title": "Popper - 气泡框",
          "group": {
            "title": "反馈",
            "path": "/docs/feedback",
            "order": 2000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Popper 气泡框",
              "heading": "popper-气泡框"
            },
            {
              "depth": 2,
              "value": "tooltip",
              "heading": "tooltip"
            },
            {
              "depth": 2,
              "value": "Popper/Confirm",
              "heading": "popperconfirm"
            },
            {
              "depth": 2,
              "value": "挂载多个气泡",
              "heading": "挂载多个气泡"
            },
            {
              "depth": 2,
              "value": "位置修复",
              "heading": "位置修复"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Popper - 气泡框"
      },
      {
        "path": "/docs/feedback/result",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__result__result.md' */'../../docs/feedback/result/result.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/feedback/result/result.md",
          "updatedTime": 1584790603000,
          "title": "Result - 结果",
          "group": {
            "title": "反馈",
            "path": "/docs/feedback",
            "order": 2000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Result 结果",
              "heading": "result-结果"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Result - 结果"
      },
      {
        "path": "/docs/feedback/skeleton",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__skeleton__skeleton.md' */'../../docs/feedback/skeleton/skeleton.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/feedback/skeleton/skeleton.md",
          "updatedTime": 1584790603000,
          "title": "Skeleton - 骨架",
          "group": {
            "title": "反馈",
            "path": "/docs/feedback",
            "order": 2000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Skeleton 抽屉",
              "heading": "skeleton-抽屉"
            },
            {
              "depth": 2,
              "value": "基础示例",
              "heading": "基础示例"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Skeleton - 骨架"
      },
      {
        "path": "/docs/form/check",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__check__check.md' */'../../docs/form/check/check.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/form/check/check.md",
          "updatedTime": 1589357899000,
          "title": "Check - 选择框",
          "group": {
            "title": "数据录入",
            "path": "/docs/form",
            "order": 3000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Check 选择框",
              "heading": "check-选择框"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "样式定制",
              "heading": "样式定制"
            },
            {
              "depth": 2,
              "value": "使用useCheck",
              "heading": "使用usecheck"
            },
            {
              "depth": 2,
              "value": "props",
              "heading": "props"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Check - 选择框"
      },
      {
        "path": "/docs/form/check-box",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__check-box__check-box.md' */'../../docs/form/check-box/check-box.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/form/check-box/check-box.md",
          "updatedTime": 1587744423000,
          "title": "CheckBox - 多选",
          "group": {
            "title": "数据录入",
            "path": "/docs/form"
          },
          "slugs": [
            {
              "depth": 1,
              "value": "CheckBox 多选",
              "heading": "checkbox-多选"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "props",
              "heading": "props"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "CheckBox - 多选"
      },
      {
        "path": "/docs/form/form",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__form__form.md' */'../../docs/form/form/form.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/form/form/form.md",
          "updatedTime": 1589912978000,
          "title": "Form - 表单",
          "group": {
            "title": "数据录入",
            "path": "/docs/form"
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Form 表单",
              "heading": "form-表单"
            },
            {
              "depth": 2,
              "value": "基本使用",
              "heading": "基本使用"
            },
            {
              "depth": 2,
              "value": "联动",
              "heading": "联动"
            },
            {
              "depth": 2,
              "value": "嵌套结构",
              "heading": "嵌套结构"
            },
            {
              "depth": 2,
              "value": "动态表单",
              "heading": "动态表单"
            },
            {
              "depth": 2,
              "value": "验证",
              "heading": "验证"
            },
            {
              "depth": 2,
              "value": "布局/样式",
              "heading": "布局样式"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            },
            {
              "depth": 3,
              "value": "Form",
              "heading": "form"
            },
            {
              "depth": 3,
              "value": "Item",
              "heading": "item"
            },
            {
              "depth": 3,
              "value": "FormProvider",
              "heading": "formprovider"
            },
            {
              "depth": 3,
              "value": "List",
              "heading": "list"
            },
            {
              "depth": 3,
              "value": "布局组件",
              "heading": "布局组件"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Form - 表单"
      },
      {
        "path": "/docs/form/input",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__input__input.md' */'../../docs/form/input/input.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/form/input/input.md",
          "updatedTime": 1585328891000,
          "title": "Input - 输入框",
          "group": {
            "title": "数据录入",
            "path": "/docs/form",
            "order": 3000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Input 输入框",
              "heading": "input-输入框"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "格式化输入",
              "heading": "格式化输入"
            },
            {
              "depth": 3,
              "value": "美化输入",
              "heading": "美化输入"
            },
            {
              "depth": 3,
              "value": "限制输入",
              "heading": "限制输入"
            },
            {
              "depth": 2,
              "value": "textArea",
              "heading": "textarea"
            },
            {
              "depth": 2,
              "value": "props",
              "heading": "props"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Input - 输入框"
      },
      {
        "path": "/docs/form/radio-box",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__radio-box__radio-box.md' */'../../docs/form/radio-box/radio-box.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/form/radio-box/radio-box.md",
          "updatedTime": 1589357899000,
          "title": "RadioBox - 单选",
          "group": {
            "title": "数据录入",
            "path": "/docs/form",
            "order": 3000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "RadioBox 单选",
              "heading": "radiobox-单选"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "props",
              "heading": "props"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "RadioBox - 单选"
      },
      {
        "path": "/docs/form/select",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__select__select.md' */'../../docs/form/select/select.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/form/select/select.md",
          "updatedTime": 1593476106000,
          "title": "Select - 选择器",
          "group": {
            "title": "数据录入",
            "path": "/docs/form"
          },
          "slugs": [
            {
              "depth": 2,
              "value": "基本使用",
              "heading": "基本使用"
            },
            {
              "depth": 2,
              "value": "多选",
              "heading": "多选"
            },
            {
              "depth": 2,
              "value": "搜索/添加 tag",
              "heading": "搜索添加-tag"
            },
            {
              "depth": 2,
              "value": "十万级数据渲染",
              "heading": "十万级数据渲染"
            },
            {
              "depth": 2,
              "value": "定制 tag 样式",
              "heading": "定制-tag-样式"
            },
            {
              "depth": 2,
              "value": "定制 toolbar",
              "heading": "定制-toolbar"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Select - 选择器"
      },
      {
        "path": "/docs/integration/scroll",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__integration__scroll__scroll.md' */'../../docs/integration/scroll/scroll.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/integration/scroll/scroll.md",
          "updatedTime": 1584790603000,
          "title": "Scroll - 滚动",
          "group": {
            "title": "集成组件",
            "path": "/docs/integration",
            "order": 4000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Scroll 滚动",
              "heading": "scroll-滚动"
            },
            {
              "depth": 2,
              "value": "基础示例",
              "heading": "基础示例"
            },
            {
              "depth": 2,
              "value": "流程解析",
              "heading": "流程解析"
            },
            {
              "depth": 3,
              "value": "下拉刷新",
              "heading": "下拉刷新"
            },
            {
              "depth": 3,
              "value": "上拉加载",
              "heading": "上拉加载"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Scroll - 滚动"
      },
      {
        "path": "/docs/utils/fork",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__utils__fork__fork.md' */'../../docs/utils/fork/fork.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/utils/fork/fork.md",
          "updatedTime": 1584790603000,
          "title": "Fork - 条件渲染",
          "group": {
            "title": "工具",
            "path": "/docs/utils",
            "order": 5000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Fork 条件渲染",
              "heading": "fork-条件渲染"
            },
            {
              "depth": 2,
              "value": "If",
              "heading": "if"
            },
            {
              "depth": 2,
              "value": "Toggle",
              "heading": "toggle"
            },
            {
              "depth": 2,
              "value": "Switch",
              "heading": "switch"
            },
            {
              "depth": 2,
              "value": "props",
              "heading": "props"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Fork - 条件渲染"
      },
      {
        "path": "/docs/utils/mask",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__utils__mask__mask.md' */'../../docs/utils/mask/mask.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/utils/mask/mask.md",
          "updatedTime": 1584790603000,
          "title": "Mask - 遮罩",
          "group": {
            "title": "反馈",
            "path": "/docs/utils",
            "order": 5000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Mask 遮罩",
              "heading": "mask-遮罩"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "Props",
              "heading": "props"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Mask - 遮罩"
      },
      {
        "path": "/docs/utils/portal",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__utils__portal__portal.md' */'../../docs/utils/portal/portal.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/utils/portal/portal.md",
          "updatedTime": 1584790603000,
          "title": "Portal - 传送门",
          "group": {
            "title": "工具",
            "path": "/docs/utils",
            "order": 5000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Portal 传送门",
              "heading": "portal-传送门"
            },
            {
              "depth": 2,
              "value": "基础示例",
              "heading": "基础示例"
            },
            {
              "depth": 2,
              "value": "指定 namespace",
              "heading": "指定-namespace"
            },
            {
              "depth": 2,
              "value": "props",
              "heading": "props"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Portal - 传送门"
      },
      {
        "path": "/docs/utils/show-from-mouse",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__utils__show-from-mouse__show-from-mouse.md' */'../../docs/utils/show-from-mouse/show-from-mouse.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/utils/show-from-mouse/show-from-mouse.md",
          "updatedTime": 1584790603000,
          "title": "ShowFromMouse - 遮罩2",
          "group": {
            "title": "工具",
            "path": "/docs/utils",
            "order": 5000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "ShowFromMouse 遮罩",
              "heading": "showfrommouse-遮罩"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "ShowFromMouse - 遮罩2"
      },
      {
        "path": "/docs/view/article-box",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__article-box__article-box.md' */'../../docs/view/article-box/article-box.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/view/article-box/article-box.md",
          "updatedTime": 1584790603000,
          "title": "ArticleBox - 富文本盒子",
          "group": {
            "title": "展示组件",
            "path": "/docs/view",
            "order": 4000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "ArticleBox 富文本盒子",
              "heading": "articlebox-富文本盒子"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "props",
              "heading": "props"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "ArticleBox - 富文本盒子"
      },
      {
        "path": "/docs/view/carousel",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__carousel__carousel.md' */'../../docs/view/carousel/carousel.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/view/carousel/carousel.md",
          "updatedTime": 1584887369000,
          "title": "Carousel - 轮播",
          "group": {
            "title": "展示组件",
            "path": "/docs/view",
            "order": 4000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Carousel 轮播",
              "heading": "carousel-轮播"
            },
            {
              "depth": 2,
              "value": "基础示例",
              "heading": "基础示例"
            },
            {
              "depth": 2,
              "value": "纵向轮播",
              "heading": "纵向轮播"
            },
            {
              "depth": 2,
              "value": "手动控制",
              "heading": "手动控制"
            },
            {
              "depth": 2,
              "value": "props",
              "heading": "props"
            },
            {
              "depth": 2,
              "value": "ref",
              "heading": "ref"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Carousel - 轮播"
      },
      {
        "path": "/docs/view/count-down",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__count-down__count-down.md' */'../../docs/view/count-down/count-down.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/view/count-down/count-down.md",
          "updatedTime": 1584790603000,
          "title": "CountDown - 倒计时",
          "group": {
            "title": "展示组件",
            "path": "/docs/view",
            "order": 4000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "CountDown 倒计时",
              "heading": "countdown-倒计时"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "自定义格式",
              "heading": "自定义格式"
            },
            {
              "depth": 2,
              "value": "props",
              "heading": "props"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "CountDown - 倒计时"
      },
      {
        "path": "/docs/view/image-preview",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__image-preview__image-preview.md' */'../../docs/view/image-preview/image-preview.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/view/image-preview/image-preview.md",
          "updatedTime": 1584790603000,
          "title": "ImagePreview - 图片浏览",
          "group": {
            "title": "展示组件",
            "path": "/docs/view",
            "order": 4000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "ImagePreview 图片浏览",
              "heading": "imagepreview-图片浏览"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "通过 api 调用",
              "heading": "通过-api-调用"
            },
            {
              "depth": 2,
              "value": "列表",
              "heading": "列表"
            },
            {
              "depth": 2,
              "value": "props",
              "heading": "props"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "ImagePreview - 图片浏览"
      },
      {
        "path": "/docs/view/list",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__list__list.md' */'../../docs/view/list/list.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/view/list/list.md",
          "updatedTime": 1589863586000,
          "title": "List - 列表",
          "group": {
            "title": "展示组件",
            "path": "/docs/view",
            "order": 4000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "List - 列表",
              "heading": "list---列表"
            },
            {
              "depth": 2,
              "value": "列表",
              "heading": "列表"
            },
            {
              "depth": 2,
              "value": "表单列表",
              "heading": "表单列表"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "List - 列表"
      },
      {
        "path": "/docs/view/picture",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__picture__picture.md' */'../../docs/view/picture/picture.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/view/picture/picture.md",
          "updatedTime": 1584790603000,
          "title": "Picture - 图片",
          "group": {
            "title": "展示组件",
            "path": "/docs/view",
            "order": 4000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Picture 图片",
              "heading": "picture-图片"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Picture - 图片"
      },
      {
        "path": "/docs/view/viewer",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__viewer__viewer.md' */'../../docs/view/viewer/viewer.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/view/viewer/viewer.md",
          "updatedTime": 1584790603000,
          "title": "Viewer - 查看器",
          "group": {
            "title": "展示组件",
            "path": "/docs/view",
            "order": 4000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Viewer 查看器",
              "heading": "viewer-查看器"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Viewer - 查看器"
      },
      {
        "path": "/docs/FAQ",
        "meta": {
          "order": 10000
        },
        "exact": true,
        "redirect": "/docs/FAQ/faq"
      },
      {
        "path": "/docs/base",
        "meta": {
          "order": 1000
        },
        "exact": true,
        "redirect": "/docs/base/button"
      },
      {
        "path": "/docs/feedback",
        "meta": {
          "order": 2000
        },
        "exact": true,
        "redirect": "/docs/feedback/action-sheet"
      },
      {
        "path": "/docs/form",
        "meta": {
          "order": 3000
        },
        "exact": true,
        "redirect": "/docs/form/check"
      },
      {
        "path": "/docs/integration",
        "meta": {
          "order": 4000
        },
        "exact": true,
        "redirect": "/docs/integration/scroll"
      },
      {
        "path": "/docs/utils",
        "meta": {
          "order": 5000
        },
        "exact": true,
        "redirect": "/docs/utils/fork"
      },
      {
        "path": "/docs/view",
        "meta": {
          "order": 4000
        },
        "exact": true,
        "redirect": "/docs/view/article-box"
      }
    ],
    "title": "fr"
  }
];

// allow user to extend routes
plugin.applyPlugins({
  key: 'patchRoutes',
  type: ApplyPluginsType.event,
  args: { routes },
});

export { routes };
