// @ts-nocheck
import { ApplyPluginsType, dynamic } from 'C:/main/git/m78/node_modules/@umijs/runtime';
import { plugin } from './plugin';

const routes = [
  {
    "path": "/~demos/:uuid",
    "layout": false,
    "wrappers": [require('C:/main/git/m78/node_modules/@umijs/preset-dumi/lib/theme/layout').default],
    "component": (props) => React.createElement(
        dynamic({
          loader: async () => {
            const { default: getDemoRenderArgs } = await import(/* webpackChunkName: 'dumi_demos' */ 'C:/main/git/m78/node_modules/@umijs/preset-dumi/lib/plugins/features/demo/getDemoRenderArgs');
            const { default: Previewer } = await import(/* webpackChunkName: 'dumi_demos' */ 'dumi-theme-default/src/builtins/Previewer.tsx');
            const { default: demos } = await import(/* webpackChunkName: 'dumi_demos' */ '@@/dumi/demos');
            const { usePrefersColor } = await import(/* webpackChunkName: 'dumi_demos' */ 'dumi/theme');

            return props => {
              
      const renderArgs = getDemoRenderArgs(props, demos);

      // for listen prefers-color-schema media change in demo single route
      usePrefersColor();

      switch (renderArgs.length) {
        case 1:
          // render demo directly
          return renderArgs[0];

        case 2:
          // render demo with previewer
          return React.createElement(
            Previewer,
            renderArgs[0],
            renderArgs[1],
          );

        default:
          return `Demo ${props.match.params.uuid} not found :(`;
      }
    
            }
          }
        }), props)
  },
  {
    "path": "/_demos/:uuid",
    "redirect": "/~demos/:uuid"
  },
  {
    "__dumiRoot": true,
    "layout": false,
    "path": "/",
    "wrappers": [require('C:/main/git/m78/node_modules/@umijs/preset-dumi/lib/theme/layout').default, require('C:/main/git/m78/node_modules/dumi-theme-default/src/layout.tsx').default],
    "routes": [
      {
        "path": "/",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'README.md' */'C:/main/git/m78/README.md')}),
        "exact": true,
        "meta": {
          "locale": "zh-CN",
          "title": "🎉Introduction",
          "order": null
        },
        "title": "🎉Introduction"
      },
      {
        "path": "/docs/other/faq",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__FAQ.md' */'C:/main/git/m78/src/docs/FAQ.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/FAQ.md",
          "updatedTime": 1606150709000,
          "title": "FAQ - 常见问题",
          "group": {
            "title": "其他",
            "path": "/docs/other",
            "order": 10000
          },
          "slugs": [
            {
              "depth": 2,
              "value": "常规",
              "heading": "常规"
            },
            {
              "depth": 3,
              "value": "没有运行时类型检测？",
              "heading": "没有运行时类型检测？"
            },
            {
              "depth": 3,
              "value": "可以和antd一起使用吗?",
              "heading": "可以和antd一起使用吗"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "FAQ - 常见问题"
      },
      {
        "path": "/docs",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__index.md' */'C:/main/git/m78/src/docs/index.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/index.md",
          "updatedTime": 1622652132000,
          "title": "快速上手",
          "order": 1,
          "slugs": [
            {
              "depth": 1,
              "value": "M78",
              "heading": "m78"
            },
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
              "value": "📘Usage",
              "heading": "usage"
            },
            {
              "depth": 3,
              "value": "导入组件",
              "heading": "导入组件"
            },
            {
              "depth": 3,
              "value": "启用sass加载器",
              "heading": "启用sass加载器"
            },
            {
              "depth": 3,
              "value": "定制主题(可选)",
              "heading": "定制主题可选"
            },
            {
              "depth": 2,
              "value": "🎄 其他",
              "heading": "-其他"
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
        "path": "/docs/other/rules",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__rules.md' */'C:/main/git/m78/src/docs/rules.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/rules.md",
          "updatedTime": 1625059519000,
          "title": "约定",
          "group": {
            "title": "其他",
            "path": "/docs/other",
            "order": 10000
          },
          "slugs": [
            {
              "depth": 2,
              "value": "项目组织",
              "heading": "项目组织"
            },
            {
              "depth": 2,
              "value": "样式约定",
              "heading": "样式约定"
            },
            {
              "depth": 2,
              "value": "组件约定",
              "heading": "组件约定"
            },
            {
              "depth": 2,
              "value": "文档",
              "heading": "文档"
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
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__base__button__button.md' */'C:/main/git/m78/src/docs/base/button/button.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/base/button/button.md",
          "updatedTime": 1607273783000,
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
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__base__ellipsis__ellipsis.md' */'C:/main/git/m78/src/docs/base/ellipsis/ellipsis.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/base/ellipsis/ellipsis.md",
          "updatedTime": 1606935375000,
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
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__base__icon__icon.md' */'C:/main/git/m78/src/docs/base/icon/icon.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/base/icon/icon.md",
          "updatedTime": 1606935375000,
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
        "path": "/docs/base/layout",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__base__layout__layout.md' */'C:/main/git/m78/src/docs/base/layout/layout.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/base/layout/layout.md",
          "updatedTime": 1621633840000,
          "title": "Layout - 布局",
          "group": {
            "title": "展示组件",
            "path": "/docs/base",
            "order": 1000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Layout 布局",
              "heading": "layout-布局"
            },
            {
              "depth": 2,
              "value": "Grids",
              "heading": "grids"
            },
            {
              "depth": 3,
              "value": "基础栅格",
              "heading": "基础栅格"
            },
            {
              "depth": 3,
              "value": "offset",
              "heading": "offset"
            },
            {
              "depth": 3,
              "value": "排序",
              "heading": "排序"
            },
            {
              "depth": 3,
              "value": "布局行为",
              "heading": "布局行为"
            },
            {
              "depth": 3,
              "value": "flex",
              "heading": "flex"
            },
            {
              "depth": 3,
              "value": "响应式栅格",
              "heading": "响应式栅格"
            },
            {
              "depth": 3,
              "value": "API",
              "heading": "api"
            },
            {
              "depth": 2,
              "value": "MediaQuery",
              "heading": "mediaquery"
            },
            {
              "depth": 3,
              "value": "MediaQuery 组件",
              "heading": "mediaquery-组件"
            },
            {
              "depth": 3,
              "value": "MediaQuery 断点",
              "heading": "mediaquery-断点"
            },
            {
              "depth": 3,
              "value": "监听器",
              "heading": "监听器"
            },
            {
              "depth": 3,
              "value": "重要 API & 类型",
              "heading": "重要-api--类型"
            },
            {
              "depth": 2,
              "value": "Flexible",
              "heading": "flexible"
            },
            {
              "depth": 2,
              "value": "原子类",
              "heading": "原子类"
            },
            {
              "depth": 2,
              "value": "Tile",
              "heading": "tile"
            },
            {
              "depth": 2,
              "value": "Grid",
              "heading": "grid"
            },
            {
              "depth": 2,
              "value": "AspectRatio",
              "heading": "aspectratio"
            },
            {
              "depth": 2,
              "value": "Divider",
              "heading": "divider"
            },
            {
              "depth": 2,
              "value": "Spacer",
              "heading": "spacer"
            },
            {
              "depth": 2,
              "value": "Center",
              "heading": "center"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api-1"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Layout - 布局"
      },
      {
        "path": "/docs/base/spin",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__base__spin__spin.md' */'C:/main/git/m78/src/docs/base/spin/spin.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/base/spin/spin.md",
          "updatedTime": 1606935375000,
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
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__action-sheet__action-sheet.md' */'C:/main/git/m78/src/docs/feedback/action-sheet/action-sheet.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/feedback/action-sheet/action-sheet.md",
          "updatedTime": 1606935375000,
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
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__anotice-bar__notice-bar.md' */'C:/main/git/m78/src/docs/feedback/anotice-bar/notice-bar.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/feedback/anotice-bar/notice-bar.md",
          "updatedTime": 1606935375000,
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
        "path": "/docs/feedback/context-menu",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__context-menu__context-menu.md' */'C:/main/git/m78/src/docs/feedback/context-menu/context-menu.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/feedback/context-menu/context-menu.md",
          "updatedTime": 1618747135000,
          "title": "ContextMenu - 上下文菜单",
          "group": {
            "title": "反馈",
            "path": "/docs/feedback",
            "order": 2000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "ContextMenu 上下文菜单",
              "heading": "contextmenu-上下文菜单"
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
        "title": "ContextMenu - 上下文菜单"
      },
      {
        "path": "/docs/feedback/dialog",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__dialog__dialog.md' */'C:/main/git/m78/src/docs/feedback/dialog/dialog.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/feedback/dialog/dialog.md",
          "updatedTime": 1607334276000,
          "title": "Dialog - 对话框",
          "group": {
            "title": "反馈",
            "path": "/docs/feedback",
            "order": 2000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Dialog 对话框",
              "heading": "dialog-对话框"
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
              "value": "API",
              "heading": "api"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Dialog - 对话框"
      },
      {
        "path": "/docs/feedback/dnd",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__dnd__dnd.md' */'C:/main/git/m78/src/docs/feedback/dnd/dnd.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/feedback/dnd/dnd.md",
          "updatedTime": 1619705272000,
          "title": "DND - 拖放",
          "group": {
            "title": "反馈",
            "path": "/docs/feedback",
            "order": 2000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "DND 拖放",
              "heading": "dnd-拖放"
            },
            {
              "depth": 2,
              "value": "基本演示",
              "heading": "基本演示"
            },
            {
              "depth": 2,
              "value": "状态/内置样式",
              "heading": "状态内置样式"
            },
            {
              "depth": 2,
              "value": "自动滚动/嵌套",
              "heading": "自动滚动嵌套"
            },
            {
              "depth": 2,
              "value": "方向",
              "heading": "方向"
            },
            {
              "depth": 2,
              "value": "添加动画",
              "heading": "添加动画"
            },
            {
              "depth": 2,
              "value": "禁用",
              "heading": "禁用"
            },
            {
              "depth": 2,
              "value": "过滤",
              "heading": "过滤"
            },
            {
              "depth": 2,
              "value": "自定义拖动把手",
              "heading": "自定义拖动把手"
            },
            {
              "depth": 2,
              "value": "自定义拖拽反馈",
              "heading": "自定义拖拽反馈"
            },
            {
              "depth": 2,
              "value": "持久化变更",
              "heading": "持久化变更"
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
        "title": "DND - 拖放"
      },
      {
        "path": "/docs/feedback/drawer",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__drawer__drawer.md' */'C:/main/git/m78/src/docs/feedback/drawer/drawer.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/feedback/drawer/drawer.md",
          "updatedTime": 1606935375000,
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
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__empty__empty.md' */'C:/main/git/m78/src/docs/feedback/empty/empty.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/feedback/empty/empty.md",
          "updatedTime": 1618747135000,
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
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__message__message.md' */'C:/main/git/m78/src/docs/feedback/message/message.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/feedback/message/message.md",
          "updatedTime": 1606935375000,
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
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__modal__modal.md' */'C:/main/git/m78/src/docs/feedback/modal/modal.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/feedback/modal/modal.md",
          "updatedTime": 1619881087000,
          "title": "Modal - 弹层",
          "group": {
            "title": "反馈",
            "path": "/docs/feedback",
            "order": 5000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Modal 弹层",
              "heading": "modal-弹层"
            },
            {
              "depth": 2,
              "value": "基本使用",
              "heading": "基本使用"
            },
            {
              "depth": 2,
              "value": "位置",
              "heading": "位置"
            },
            {
              "depth": 2,
              "value": "动画",
              "heading": "动画"
            },
            {
              "depth": 2,
              "value": "遮罩",
              "heading": "遮罩"
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
        "title": "Modal - 弹层"
      },
      {
        "path": "/docs/feedback/popper",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__popper__popper.md' */'C:/main/git/m78/src/docs/feedback/popper/popper.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/feedback/popper/popper.md",
          "updatedTime": 1606935375000,
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
              "value": "popper/confirm",
              "heading": "popperconfirm"
            },
            {
              "depth": 2,
              "value": "trigger",
              "heading": "trigger"
            },
            {
              "depth": 2,
              "value": "target",
              "heading": "target"
            },
            {
              "depth": 2,
              "value": "控制显示行为",
              "heading": "控制显示行为"
            },
            {
              "depth": 2,
              "value": "flip",
              "heading": "flip"
            },
            {
              "depth": 2,
              "value": "定制",
              "heading": "定制"
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
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__result__result.md' */'C:/main/git/m78/src/docs/feedback/result/result.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/feedback/result/result.md",
          "updatedTime": 1606935375000,
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
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__skeleton__skeleton.md' */'C:/main/git/m78/src/docs/feedback/skeleton/skeleton.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/feedback/skeleton/skeleton.md",
          "updatedTime": 1618126780000,
          "title": "Skeleton - 骨架",
          "group": {
            "title": "反馈",
            "path": "/docs/feedback",
            "order": 2000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Skeleton 骨架",
              "heading": "skeleton-骨架"
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
        "path": "/docs/feedback/tips",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__feedback__tips__tips.md' */'C:/main/git/m78/src/docs/feedback/tips/tips.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/feedback/tips/tips.md",
          "updatedTime": 1606935375000,
          "title": "Tips - 轻提示",
          "group": {
            "title": "反馈",
            "path": "/docs/feedback",
            "order": 2000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Tips 轻提示",
              "heading": "tips-轻提示"
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
        "title": "Tips - 轻提示"
      },
      {
        "path": "/docs/form/check",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__check__check.md' */'C:/main/git/m78/src/docs/form/check/check.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/form/check/check.md",
          "updatedTime": 1606935375000,
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
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__check-box__check-box.md' */'C:/main/git/m78/src/docs/form/check-box/check-box.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/form/check-box/check-box.md",
          "updatedTime": 1606935375000,
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
        "path": "/docs/form/dates",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__dates__dates.md' */'C:/main/git/m78/src/docs/form/dates/dates.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/form/dates/dates.md",
          "updatedTime": 1606935375000,
          "title": "Dates - 时间",
          "group": {
            "title": "数据录入",
            "path": "/docs/form"
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Dates 时间",
              "heading": "dates-时间"
            },
            {
              "depth": 2,
              "value": "基本使用",
              "heading": "基本使用"
            },
            {
              "depth": 2,
              "value": "范围选择",
              "heading": "范围选择"
            },
            {
              "depth": 2,
              "value": "限制日期/时间",
              "heading": "限制日期时间"
            },
            {
              "depth": 2,
              "value": "组件模式",
              "heading": "组件模式"
            },
            {
              "depth": 2,
              "value": "日历模式",
              "heading": "日历模式"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            },
            {
              "depth": 3,
              "value": "props",
              "heading": "props"
            },
            {
              "depth": 3,
              "value": "限制器",
              "heading": "限制器"
            },
            {
              "depth": 3,
              "value": "相关接口",
              "heading": "相关接口"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Dates - 时间"
      },
      {
        "path": "/docs/form/form",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__form__form.md' */'C:/main/git/m78/src/docs/form/form/form.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/form/form/form.md",
          "updatedTime": 1621208829000,
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
              "value": "动态表单 + 拖动排序",
              "heading": "动态表单--拖动排序"
            },
            {
              "depth": 2,
              "value": "联动",
              "heading": "联动"
            },
            {
              "depth": 2,
              "value": "验证",
              "heading": "验证"
            },
            {
              "depth": 3,
              "value": "基础验证",
              "heading": "基础验证"
            },
            {
              "depth": 3,
              "value": "表单级验证",
              "heading": "表单级验证"
            },
            {
              "depth": 2,
              "value": "布局/样式",
              "heading": "布局样式"
            },
            {
              "depth": 3,
              "value": "基础布局",
              "heading": "基础布局"
            },
            {
              "depth": 3,
              "value": "内联表单",
              "heading": "内联表单"
            },
            {
              "depth": 3,
              "value": "自定义样式",
              "heading": "自定义样式"
            },
            {
              "depth": 2,
              "value": "表单实例",
              "heading": "表单实例"
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
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__input__input.md' */'C:/main/git/m78/src/docs/form/input/input.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/form/input/input.md",
          "updatedTime": 1606935375000,
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
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__radio-box__radio-box.md' */'C:/main/git/m78/src/docs/form/radio-box/radio-box.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/form/radio-box/radio-box.md",
          "updatedTime": 1606935375000,
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
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__select__select.md' */'C:/main/git/m78/src/docs/form/select/select.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/form/select/select.md",
          "updatedTime": 1606935375000,
          "title": "Select - 选择器",
          "group": {
            "title": "数据录入",
            "path": "/docs/form"
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Select 选择器",
              "heading": "select-选择器"
            },
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
              "value": "Dropdown 模式",
              "heading": "dropdown-模式"
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
        "path": "/docs/form/tree",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__form__tree__tree.md' */'C:/main/git/m78/src/docs/form/tree/tree.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/form/tree/tree.md",
          "updatedTime": 1625059676000,
          "title": "Tree - 树形菜单",
          "group": {
            "title": "数据录入",
            "path": "/docs/form",
            "order": 3000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Tree 树形菜单",
              "heading": "tree-树形菜单"
            },
            {
              "depth": 2,
              "value": "基础示例",
              "heading": "基础示例"
            },
            {
              "depth": 2,
              "value": "单选",
              "heading": "单选"
            },
            {
              "depth": 2,
              "value": "多选",
              "heading": "多选"
            },
            {
              "depth": 2,
              "value": "展开行为",
              "heading": "展开行为"
            },
            {
              "depth": 2,
              "value": "十万级数据渲染",
              "heading": "十万级数据渲染"
            },
            {
              "depth": 2,
              "value": "动态加载",
              "heading": "动态加载"
            },
            {
              "depth": 2,
              "value": "手风琴模式",
              "heading": "手风琴模式"
            },
            {
              "depth": 2,
              "value": "尺寸",
              "heading": "尺寸"
            },
            {
              "depth": 2,
              "value": "工具条",
              "heading": "工具条"
            },
            {
              "depth": 2,
              "value": "自定义",
              "heading": "自定义"
            },
            {
              "depth": 2,
              "value": "连接线",
              "heading": "连接线"
            },
            {
              "depth": 2,
              "value": "拖拽模式",
              "heading": "拖拽模式"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            },
            {
              "depth": 3,
              "value": "Props",
              "heading": "props"
            },
            {
              "depth": 3,
              "value": "TreeDataSource",
              "heading": "treedatasource"
            },
            {
              "depth": 3,
              "value": "TreeNode",
              "heading": "treenode"
            },
            {
              "depth": 3,
              "value": "Toolbar",
              "heading": "toolbar"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Tree - 树形菜单"
      },
      {
        "path": "/docs/Navigation/back-top",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__Navigation__back-top__back-top.md' */'C:/main/git/m78/src/docs/Navigation/back-top/back-top.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/Navigation/back-top/back-top.md",
          "updatedTime": 1606935375000,
          "title": "BackTop - 返回顶部",
          "group": {
            "title": "导航",
            "path": "/docs/Navigation",
            "order": 4000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "BackTop 返回顶部",
              "heading": "backtop-返回顶部"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "指定元素",
              "heading": "指定元素"
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
        "title": "BackTop - 返回顶部"
      },
      {
        "path": "/docs/Navigation/page-header",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__Navigation__page-header__page-header.md' */'C:/main/git/m78/src/docs/Navigation/page-header/page-header.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/Navigation/page-header/page-header.md",
          "updatedTime": 1606935375000,
          "title": "PageHeader - 页头",
          "group": {
            "title": "导航",
            "path": "/docs/Navigation",
            "order": 4000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "PageHeader 页头",
              "heading": "pageheader-页头"
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
        "title": "PageHeader - 页头"
      },
      {
        "path": "/docs/Navigation/pagination",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__Navigation__pagination__pagination.md' */'C:/main/git/m78/src/docs/Navigation/pagination/pagination.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/Navigation/pagination/pagination.md",
          "updatedTime": 1606935375000,
          "title": "Pagination - 分页器",
          "group": {
            "title": "导航",
            "path": "/docs/Navigation",
            "order": 4000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Pagination 分页器",
              "heading": "pagination-分页器"
            },
            {
              "depth": 2,
              "value": "基本使用",
              "heading": "基本使用"
            },
            {
              "depth": 2,
              "value": "定制",
              "heading": "定制"
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
        "title": "Pagination - 分页器"
      },
      {
        "path": "/docs/Navigation/pin",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__Navigation__pin__pin.md' */'C:/main/git/m78/src/docs/Navigation/pin/pin.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/Navigation/pin/pin.md",
          "updatedTime": 1606935375000,
          "title": "Pin - 固钉",
          "group": {
            "title": "导航",
            "path": "/docs/Navigation",
            "order": 4000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Pin 固钉",
              "heading": "pin-固钉"
            },
            {
              "depth": 2,
              "value": "窗口固钉",
              "heading": "窗口固钉"
            },
            {
              "depth": 2,
              "value": "指定 target",
              "heading": "指定-target"
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
        "title": "Pin - 固钉"
      },
      {
        "path": "/docs/Navigation/tab",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__Navigation__tab__tab.md' */'C:/main/git/m78/src/docs/Navigation/tab/tab.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/Navigation/tab/tab.md",
          "updatedTime": 1607099548000,
          "title": "Tab - 选项卡",
          "group": {
            "title": "导航",
            "path": "/docs/Navigation",
            "order": 4000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Tab 选项卡",
              "heading": "tab-选项卡"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "尺寸",
              "heading": "尺寸"
            },
            {
              "depth": 2,
              "value": "方向",
              "heading": "方向"
            },
            {
              "depth": 2,
              "value": "flexible",
              "heading": "flexible"
            },
            {
              "depth": 2,
              "value": "选项可滚动",
              "heading": "选项可滚动"
            },
            {
              "depth": 2,
              "value": "自定义样式",
              "heading": "自定义样式"
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
        "title": "Tab - 选项卡"
      },
      {
        "path": "/docs/utils/auth",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__utils__auth__auth.md' */'C:/main/git/m78/src/docs/utils/auth/auth.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/utils/auth/auth.md",
          "updatedTime": 1622350546000,
          "title": "Auth - 权限",
          "group": {
            "title": "工具包",
            "path": "/docs/utils",
            "order": 5000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Auth 权限",
              "heading": "auth-权限"
            },
            {
              "depth": 2,
              "value": "Auth",
              "heading": "auth"
            },
            {
              "depth": 3,
              "value": "基本示例",
              "heading": "基本示例"
            },
            {
              "depth": 3,
              "value": "反馈方式",
              "heading": "反馈方式"
            },
            {
              "depth": 3,
              "value": "withAuth",
              "heading": "withauth"
            },
            {
              "depth": 3,
              "value": "useAuth",
              "heading": "useauth"
            },
            {
              "depth": 3,
              "value": "or",
              "heading": "or"
            },
            {
              "depth": 3,
              "value": "额外参数",
              "heading": "额外参数"
            },
            {
              "depth": 3,
              "value": "定制反馈节点",
              "heading": "定制反馈节点"
            },
            {
              "depth": 3,
              "value": "局部验证器",
              "heading": "局部验证器"
            },
            {
              "depth": 3,
              "value": "api 速览",
              "heading": "api-速览"
            },
            {
              "depth": 2,
              "value": "AuthPro",
              "heading": "authpro"
            },
            {
              "depth": 3,
              "value": "理解 auth string",
              "heading": "理解-auth-string"
            },
            {
              "depth": 3,
              "value": "基本示例",
              "heading": "基本示例-1"
            },
            {
              "depth": 3,
              "value": "api 速览",
              "heading": "api-速览-1"
            },
            {
              "depth": 3,
              "value": "与后端集成",
              "heading": "与后端集成"
            },
            {
              "depth": 3,
              "value": "自定义 key",
              "heading": "自定义-key"
            },
            {
              "depth": 3,
              "value": "用户端的 RBAC",
              "heading": "用户端的-rbac"
            },
            {
              "depth": 3,
              "value": "string 与 map",
              "heading": "string-与-map"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Auth - 权限"
      },
      {
        "path": "/docs/utils/error-boundary",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__utils__error-boundary__error-boundary.md' */'C:/main/git/m78/src/docs/utils/error-boundary/error-boundary.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/utils/error-boundary/error-boundary.md",
          "updatedTime": 1622350546000,
          "title": "ErrorBoundary - 错误边界",
          "group": {
            "title": "工具包",
            "path": "/docs/utils",
            "order": 5000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "ErrorBoundary 错误边界",
              "heading": "errorboundary-错误边界"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "定制",
              "heading": "定制"
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
        "title": "ErrorBoundary - 错误边界"
      },
      {
        "path": "/docs/utils/fork",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__utils__fork__fork.md' */'C:/main/git/m78/src/docs/utils/fork/fork.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/utils/fork/fork.md",
          "updatedTime": 1622350546000,
          "title": "Fork - 条件渲染",
          "group": {
            "title": "工具包",
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
              "value": "Fork",
              "heading": "fork"
            },
            {
              "depth": 2,
              "value": "Fork Custom",
              "heading": "fork-custom"
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
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__utils__mask__mask.md' */'C:/main/git/m78/src/docs/utils/mask/mask.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/utils/mask/mask.md",
          "updatedTime": 1622350546000,
          "title": "Mask - 遮罩",
          "group": {
            "title": "工具包",
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
              "value": "deprecated!!!",
              "heading": "deprecated"
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
        "path": "/docs/utils/no-ssr",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__utils__No-ssr__no-ssr.md' */'C:/main/git/m78/src/docs/utils/No-ssr/no-ssr.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/utils/No-ssr/no-ssr.md",
          "updatedTime": 1622350546000,
          "title": "NoSSR - 非服务端渲染",
          "group": {
            "title": "工具包",
            "path": "/docs/utils",
            "order": 5000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "NoSSR - 非服务端渲染",
              "heading": "nossr---非服务端渲染"
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
        "title": "NoSSR - 非服务端渲染"
      },
      {
        "path": "/docs/utils/portal",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__utils__portal__portal.md' */'C:/main/git/m78/src/docs/utils/portal/portal.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/utils/portal/portal.md",
          "updatedTime": 1622350546000,
          "title": "Portal - 传送门",
          "group": {
            "title": "工具包",
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
        "path": "/docs/utils/render-api",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__utils__render-api__render-api.md' */'C:/main/git/m78/src/docs/utils/render-api/render-api.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/utils/render-api/render-api.md",
          "updatedTime": 1622350546000,
          "title": "RenderApi - 渲染api",
          "group": {
            "title": "工具包",
            "path": "/docs/utils",
            "order": 5000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "RenderApi 渲染 api",
              "heading": "renderapi-渲染-api"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "RenderApi - 渲染api"
      },
      {
        "path": "/docs/utils/seed",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__utils__seed__seed.md' */'C:/main/git/m78/src/docs/utils/seed/seed.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/utils/seed/seed.md",
          "updatedTime": 1622350546000,
          "title": "Seed - 种子",
          "group": {
            "title": "工具包",
            "path": "/docs/utils",
            "order": 5000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Seed 种子",
              "heading": "seed-种子"
            },
            {
              "depth": 2,
              "value": "使用",
              "heading": "使用"
            },
            {
              "depth": 2,
              "value": "中间件",
              "heading": "中间件"
            },
            {
              "depth": 2,
              "value": "编写中间件",
              "heading": "编写中间件"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            },
            {
              "depth": 3,
              "value": "Seed实例",
              "heading": "seed实例"
            },
            {
              "depth": 3,
              "value": "createSeed()",
              "heading": "createseed"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Seed - 种子"
      },
      {
        "path": "/docs/view/article-box",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__article-box__article-box.md' */'C:/main/git/m78/src/docs/view/article-box/article-box.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/view/article-box/article-box.md",
          "updatedTime": 1606935375000,
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
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__carousel__carousel.md' */'C:/main/git/m78/src/docs/view/carousel/carousel.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/view/carousel/carousel.md",
          "updatedTime": 1606935375000,
          "title": "Carousel - 滚动带",
          "group": {
            "title": "展示组件",
            "path": "/docs/view",
            "order": 4000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Carousel 滚动带",
              "heading": "carousel-滚动带"
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
              "value": "性能",
              "heading": "性能"
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
        "title": "Carousel - 滚动带"
      },
      {
        "path": "/docs/view/count-down",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__count-down__count-down.md' */'C:/main/git/m78/src/docs/view/count-down/count-down.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/view/count-down/count-down.md",
          "updatedTime": 1606935375000,
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
        "path": "/docs/view/expansion",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__expansion__expansion.md' */'C:/main/git/m78/src/docs/view/expansion/expansion.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/view/expansion/expansion.md",
          "updatedTime": 1606935375000,
          "title": "Expansion - 折叠面板",
          "group": {
            "title": "展示组件",
            "path": "/docs/view",
            "order": 4000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Expansion 折叠面板",
              "heading": "expansion-折叠面板"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "手风琴",
              "heading": "手风琴"
            },
            {
              "depth": 2,
              "value": "嵌套",
              "heading": "嵌套"
            },
            {
              "depth": 2,
              "value": "单独使用 Pane",
              "heading": "单独使用-pane"
            },
            {
              "depth": 2,
              "value": "定制",
              "heading": "定制"
            },
            {
              "depth": 2,
              "value": "性能",
              "heading": "性能"
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
        "title": "Expansion - 折叠面板"
      },
      {
        "path": "/docs/view/image-preview",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__image-preview__image-preview.md' */'C:/main/git/m78/src/docs/view/image-preview/image-preview.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/view/image-preview/image-preview.md",
          "updatedTime": 1606935375000,
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
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__list__list.md' */'C:/main/git/m78/src/docs/view/list/list.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/view/list/list.md",
          "updatedTime": 1619881125000,
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
              "value": "deprecated!!!",
              "heading": "deprecated"
            },
            {
              "depth": 2,
              "value": "列表",
              "heading": "列表"
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
        "path": "/docs/view/list-view",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__list-view__list-view.md' */'C:/main/git/m78/src/docs/view/list-view/list-view.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/view/list-view/list-view.md",
          "updatedTime": 1622350546000,
          "title": "ListView - 列表",
          "group": {
            "title": "展示组件",
            "path": "/docs/view"
          },
          "slugs": [
            {
              "depth": 1,
              "value": "ListView - 列表",
              "heading": "listview---列表"
            },
            {
              "depth": 2,
              "value": "列表",
              "heading": "列表"
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
        "title": "ListView - 列表"
      },
      {
        "path": "/docs/view/picture",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__picture__picture.md' */'C:/main/git/m78/src/docs/view/picture/picture.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/view/picture/picture.md",
          "updatedTime": 1606935375000,
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
        "path": "/docs/view/scroller",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__scroller__scroller.md' */'C:/main/git/m78/src/docs/view/scroller/scroller.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/view/scroller/scroller.md",
          "updatedTime": 1613804758000,
          "title": "Scroller - 滚动容器",
          "group": {
            "title": "展示组件",
            "path": "/docs/view",
            "order": 4000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Scroller 滚动容器",
              "heading": "scroller-滚动容器"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "滚动指示",
              "heading": "滚动指示"
            },
            {
              "depth": 2,
              "value": "滚动条",
              "heading": "滚动条"
            },
            {
              "depth": 2,
              "value": "滚动控制",
              "heading": "滚动控制"
            },
            {
              "depth": 2,
              "value": "上拉加载/下拉刷新",
              "heading": "上拉加载下拉刷新"
            },
            {
              "depth": 2,
              "value": "下拉刷新进阶",
              "heading": "下拉刷新进阶"
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
        "title": "Scroller - 滚动容器"
      },
      {
        "path": "/docs/view/table",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__table__table.md' */'C:/main/git/m78/src/docs/view/table/table.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/view/table/table.md",
          "updatedTime": 1625059676000,
          "title": "Table - 表格",
          "group": {
            "title": "展示组件",
            "path": "/docs/view",
            "order": 4000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "Table 表格",
              "heading": "table-表格"
            },
            {
              "depth": 2,
              "value": "deprecated!!!",
              "heading": "deprecated"
            },
            {
              "depth": 2,
              "value": "常规",
              "heading": "常规"
            },
            {
              "depth": 3,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 3,
              "value": "字段值渲染",
              "heading": "字段值渲染"
            },
            {
              "depth": 3,
              "value": "大数据量渲染",
              "heading": "大数据量渲染"
            },
            {
              "depth": 3,
              "value": "样式",
              "heading": "样式"
            },
            {
              "depth": 3,
              "value": "单元格 props",
              "heading": "单元格-props"
            },
            {
              "depth": 3,
              "value": "固定列",
              "heading": "固定列"
            },
            {
              "depth": 3,
              "value": "合并单元格",
              "heading": "合并单元格"
            },
            {
              "depth": 3,
              "value": "valueGetter",
              "heading": "valuegetter"
            },
            {
              "depth": 3,
              "value": "排序",
              "heading": "排序"
            },
            {
              "depth": 3,
              "value": "过滤",
              "heading": "过滤"
            },
            {
              "depth": 3,
              "value": "总计栏",
              "heading": "总计栏"
            },
            {
              "depth": 2,
              "value": "选择",
              "heading": "选择"
            },
            {
              "depth": 3,
              "value": "多选",
              "heading": "多选"
            },
            {
              "depth": 3,
              "value": "单选",
              "heading": "单选"
            },
            {
              "depth": 2,
              "value": "树形表格",
              "heading": "树形表格"
            },
            {
              "depth": 3,
              "value": "基础示例",
              "heading": "基础示例"
            },
            {
              "depth": 3,
              "value": "多选",
              "heading": "多选-1"
            },
            {
              "depth": 3,
              "value": "单选",
              "heading": "单选-1"
            },
            {
              "depth": 3,
              "value": "展开行为",
              "heading": "展开行为"
            },
            {
              "depth": 3,
              "value": "动态加载",
              "heading": "动态加载"
            },
            {
              "depth": 3,
              "value": "手风琴",
              "heading": "手风琴"
            },
            {
              "depth": 2,
              "value": "Api",
              "heading": "api"
            },
            {
              "depth": 3,
              "value": "Table",
              "heading": "table"
            },
            {
              "depth": 3,
              "value": "Column",
              "heading": "column"
            },
            {
              "depth": 3,
              "value": "TreeDataSource",
              "heading": "treedatasource"
            },
            {
              "depth": 3,
              "value": "TableTreeNode",
              "heading": "tabletreenode"
            }
          ],
          "nav": {
            "path": "/docs",
            "title": "Docs"
          }
        },
        "title": "Table - 表格"
      },
      {
        "path": "/docs/view/view-num",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__view-num__view-num.md' */'C:/main/git/m78/src/docs/view/view-num/view-num.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/view/view-num/view-num.md",
          "updatedTime": 1606935375000,
          "title": "ViewNum - 数字",
          "group": {
            "title": "展示组件",
            "path": "/docs/view",
            "order": 4000
          },
          "slugs": [
            {
              "depth": 1,
              "value": "ViewNum 数字",
              "heading": "viewnum-数字"
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
        "title": "ViewNum - 数字"
      },
      {
        "path": "/docs/view/viewer",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'docs__view__viewer__viewer.md' */'C:/main/git/m78/src/docs/view/viewer/viewer.md')}),
        "exact": true,
        "meta": {
          "filePath": "src/docs/view/viewer/viewer.md",
          "updatedTime": 1606935375000,
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
        "path": "/docs/other",
        "meta": {
          "order": 10000
        },
        "exact": true,
        "redirect": "/docs/other/faq"
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
        "path": "/docs/Navigation",
        "meta": {
          "order": 4000
        },
        "exact": true,
        "redirect": "/docs/Navigation/back-top"
      },
      {
        "path": "/docs/utils",
        "meta": {
          "order": 5000
        },
        "exact": true,
        "redirect": "/docs/utils/auth"
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
    "title": "M78",
    "component": (props) => props.children
  }
];

// allow user to extend routes
plugin.applyPlugins({
  key: 'patchRoutes',
  type: ApplyPluginsType.event,
  args: { routes },
});

export { routes };
