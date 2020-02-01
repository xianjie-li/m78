import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';

const Router = DefaultRouter;

const routes = [
  {
    path: '/',
    component: props =>
      React.createElement(
        require('C:/Users/Administrator/Desktop/flicker/node_modules/umi-plugin-father-doc/lib/themes/default/layout.js')
          .default,
        {
          ...{
            menus: [
              {
                items: [
                  {
                    path: '/docs/page1',
                    title: '主页',
                    meta: {
                      group: { path: null },
                      title: '主页',
                      order: 10,
                      slugs: [
                        { depth: 1, value: '主页', heading: '主页' },
                        { depth: 1, value: 'demo', heading: 'demo' },
                      ],
                    },
                  },
                  {
                    path: '/docs/page2',
                    title: 'page2',
                    meta: {
                      group: { path: null },
                      title: 'page2',
                      order: 9,
                      slugs: [{ depth: 1, value: 'page2', heading: 'page2' }],
                    },
                  },
                  {
                    title: '基础组件',
                    path: '/base',
                    meta: { order: 1 },
                    children: [
                      {
                        path: '/base/button',
                        title: 'Button - 按钮',
                        meta: {
                          group: { path: '/base', title: '基础组件', order: 1 },
                          title: 'Button - 按钮',
                          slugs: [
                            { depth: 1, value: '颜色', heading: '颜色' },
                            { depth: 1, value: '禁用', heading: '禁用' },
                            { depth: 1, value: '尺寸', heading: '尺寸' },
                            {
                              depth: 1,
                              value: '圆形按钮',
                              heading: '圆形按钮',
                            },
                            {
                              depth: 1,
                              value: '透明 + 边框',
                              heading: '透明--边框',
                            },
                            { depth: 1, value: '加载中', heading: '加载中' },
                            {
                              depth: 1,
                              value: '块级按钮',
                              heading: '块级按钮',
                            },
                            {
                              depth: 1,
                              value: '链接按钮',
                              heading: '链接按钮',
                            },
                            {
                              depth: 1,
                              value: '图标按钮',
                              heading: '图标按钮',
                            },
                            {
                              depth: 1,
                              value: '交互效果',
                              heading: '交互效果',
                            },
                            { depth: 1, value: 'props', heading: 'props' },
                          ],
                        },
                      },
                      {
                        path: '/base/icon',
                        title: 'Icon - 图标',
                        meta: {
                          group: { path: '/base', title: '基础组件', order: 1 },
                          title: 'Icon - 图标',
                          slugs: [
                            {
                              depth: 1,
                              value: '代码示例',
                              heading: '代码示例',
                            },
                            {
                              depth: 1,
                              value: '单色图标',
                              heading: '单色图标',
                            },
                            { depth: 1, value: 'svg图标', heading: 'svg图标' },
                            { depth: 1, value: 'props', heading: 'props' },
                          ],
                        },
                      },
                      {
                        path: '/base/spin',
                        title: 'Spin - 加载中',
                        meta: {
                          group: { path: '/base', title: '基础组件', order: 0 },
                          title: 'Spin - 加载中',
                          slugs: [
                            {
                              depth: 1,
                              value: '基本用法',
                              heading: '基本用法',
                            },
                            { depth: 1, value: '内联', heading: '内联' },
                            {
                              depth: 1,
                              value: '自定义文本',
                              heading: '自定义文本',
                            },
                            {
                              depth: 1,
                              value: '填满容器',
                              heading: '填满容器',
                            },
                            { depth: 1, value: 'props', heading: 'props' },
                          ],
                        },
                      },
                    ],
                  },
                  {
                    title: '展示组件',
                    path: '/view',
                    meta: { order: 1 },
                    children: [
                      {
                        path: '/view/article-box',
                        title: 'ArticleBox - 富文本盒子',
                        meta: {
                          group: { path: '/view', title: '展示组件', order: 1 },
                          title: 'ArticleBox - 富文本盒子',
                          slugs: [
                            { depth: 1, value: '示例', heading: '示例' },
                            { depth: 1, value: 'props', heading: 'props' },
                          ],
                        },
                      },
                      {
                        path: '/view/carousel',
                        title: 'Carousel - 轮播',
                        meta: {
                          group: { path: '/view', title: '展示组件', order: 1 },
                          title: 'Carousel - 轮播',
                          slugs: [
                            {
                              depth: 1,
                              value: '基础示例',
                              heading: '基础示例',
                            },
                            {
                              depth: 1,
                              value: '纵向轮播',
                              heading: '纵向轮播',
                            },
                            {
                              depth: 1,
                              value: '手动控制',
                              heading: '手动控制',
                            },
                            { depth: 1, value: 'props', heading: 'props' },
                            { depth: 1, value: 'ref', heading: 'ref' },
                          ],
                        },
                      },
                      {
                        path: '/view/count-down',
                        title: 'CountDown - 倒计时',
                        meta: {
                          group: { path: '/view', title: '展示组件', order: 1 },
                          title: 'CountDown - 倒计时',
                          slugs: [
                            { depth: 1, value: '示例', heading: '示例' },
                            {
                              depth: 1,
                              value: '自定义格式',
                              heading: '自定义格式',
                            },
                            { depth: 1, value: 'props', heading: 'props' },
                          ],
                        },
                      },
                    ],
                  },
                  {
                    title: '工具',
                    path: '/utils',
                    meta: { order: 1 },
                    children: [
                      {
                        path: '/utils/fork',
                        title: 'Fork',
                        meta: {
                          group: { path: '/utils', title: '工具', order: 1 },
                          title: 'Fork',
                          slugs: [
                            { depth: 1, value: 'If', heading: 'if' },
                            { depth: 1, value: 'Toggle', heading: 'toggle' },
                            { depth: 1, value: 'Switch', heading: 'switch' },
                            { depth: 1, value: 'props', heading: 'props' },
                          ],
                        },
                      },
                      {
                        path: '/utils/portal',
                        title: 'Portal - 传送门',
                        meta: {
                          group: { path: '/utils', title: '工具', order: 1 },
                          title: 'Portal - 传送门',
                          slugs: [
                            {
                              depth: 1,
                              value: '基础示例',
                              heading: '基础示例',
                            },
                            {
                              depth: 1,
                              value: '指定namespace',
                              heading: '指定namespace',
                            },
                            { depth: 1, value: 'props', heading: 'props' },
                          ],
                        },
                      },
                    ],
                  },
                  {
                    title: '反馈',
                    path: '/feedback',
                    meta: {},
                    children: [
                      {
                        path: '/feedback/message',
                        title: 'Message - 消息提醒',
                        meta: {
                          group: { path: '/feedback', title: '反馈' },
                          title: 'Message - 消息提醒',
                          slugs: [
                            {
                              depth: 1,
                              value: '基础示例',
                              heading: '基础示例',
                            },
                            { depth: 1, value: '底层api', heading: '底层api' },
                            { depth: 1, value: 'API', heading: 'api' },
                          ],
                        },
                      },
                    ],
                  },
                ],
              },
            ],
            title: 'flicker',
            logo: '../public/logo.png',
            desc: '完全使用hooks编写的轻量组件库',
          },
          ...props,
        },
      ),
    routes: [
      {
        path: '/docs/page1',
        component: require('../docs/page1.md').default,
        exact: true,
        meta: {
          group: {
            path: null,
          },
          title: '主页',
          order: 10,
          slugs: [
            {
              depth: 1,
              value: '主页',
              heading: '主页',
            },
            {
              depth: 1,
              value: 'demo',
              heading: 'demo',
            },
          ],
        },
        title: '主页',
        Routes: [require('./TitleWrapper.jsx').default],
        _title: 'flicker - 主页',
        _title_default: 'flicker',
      },
      {
        path: '/docs/page2',
        component: require('../docs/page2.md').default,
        exact: true,
        meta: {
          group: {
            path: null,
          },
          title: 'page2',
          order: 9,
          slugs: [
            {
              depth: 1,
              value: 'page2',
              heading: 'page2',
            },
          ],
        },
        title: 'page2',
        Routes: [require('./TitleWrapper.jsx').default],
        _title: 'flicker - page2',
        _title_default: 'flicker',
      },
      {
        path: '/base/button',
        component: require('../docs/base/button/button.md').default,
        exact: true,
        meta: {
          group: {
            path: '/base',
            title: '基础组件',
            order: 1,
          },
          title: 'Button - 按钮',
          slugs: [
            {
              depth: 1,
              value: '颜色',
              heading: '颜色',
            },
            {
              depth: 1,
              value: '禁用',
              heading: '禁用',
            },
            {
              depth: 1,
              value: '尺寸',
              heading: '尺寸',
            },
            {
              depth: 1,
              value: '圆形按钮',
              heading: '圆形按钮',
            },
            {
              depth: 1,
              value: '透明 + 边框',
              heading: '透明--边框',
            },
            {
              depth: 1,
              value: '加载中',
              heading: '加载中',
            },
            {
              depth: 1,
              value: '块级按钮',
              heading: '块级按钮',
            },
            {
              depth: 1,
              value: '链接按钮',
              heading: '链接按钮',
            },
            {
              depth: 1,
              value: '图标按钮',
              heading: '图标按钮',
            },
            {
              depth: 1,
              value: '交互效果',
              heading: '交互效果',
            },
            {
              depth: 1,
              value: 'props',
              heading: 'props',
            },
          ],
        },
        title: 'Button - 按钮',
        Routes: [require('./TitleWrapper.jsx').default],
        _title: 'flicker - Button - 按钮',
        _title_default: 'flicker',
      },
      {
        path: '/base/icon',
        component: require('../docs/base/icon/icon.md').default,
        exact: true,
        meta: {
          group: {
            path: '/base',
            title: '基础组件',
            order: 1,
          },
          title: 'Icon - 图标',
          slugs: [
            {
              depth: 1,
              value: '代码示例',
              heading: '代码示例',
            },
            {
              depth: 1,
              value: '单色图标',
              heading: '单色图标',
            },
            {
              depth: 1,
              value: 'svg图标',
              heading: 'svg图标',
            },
            {
              depth: 1,
              value: 'props',
              heading: 'props',
            },
          ],
        },
        title: 'Icon - 图标',
        Routes: [require('./TitleWrapper.jsx').default],
        _title: 'flicker - Icon - 图标',
        _title_default: 'flicker',
      },
      {
        path: '/base/spin',
        component: require('../docs/base/spin/spin.md').default,
        exact: true,
        meta: {
          group: {
            path: '/base',
            title: '基础组件',
            order: 0,
          },
          title: 'Spin - 加载中',
          slugs: [
            {
              depth: 1,
              value: '基本用法',
              heading: '基本用法',
            },
            {
              depth: 1,
              value: '内联',
              heading: '内联',
            },
            {
              depth: 1,
              value: '自定义文本',
              heading: '自定义文本',
            },
            {
              depth: 1,
              value: '填满容器',
              heading: '填满容器',
            },
            {
              depth: 1,
              value: 'props',
              heading: 'props',
            },
          ],
        },
        title: 'Spin - 加载中',
        Routes: [require('./TitleWrapper.jsx').default],
        _title: 'flicker - Spin - 加载中',
        _title_default: 'flicker',
      },
      {
        path: '/feedback/message',
        component: require('../docs/feedback/message/message.md').default,
        exact: true,
        meta: {
          group: {
            path: '/feedback',
            title: '反馈',
          },
          title: 'Message - 消息提醒',
          slugs: [
            {
              depth: 1,
              value: '基础示例',
              heading: '基础示例',
            },
            {
              depth: 1,
              value: '底层api',
              heading: '底层api',
            },
            {
              depth: 1,
              value: 'API',
              heading: 'api',
            },
          ],
        },
        title: 'Message - 消息提醒',
        Routes: [require('./TitleWrapper.jsx').default],
        _title: 'flicker - Message - 消息提醒',
        _title_default: 'flicker',
      },
      {
        path: '/utils/fork',
        component: require('../docs/utils/fork/fork.md').default,
        exact: true,
        meta: {
          group: {
            path: '/utils',
            title: '工具',
            order: 1,
          },
          title: 'Fork',
          slugs: [
            {
              depth: 1,
              value: 'If',
              heading: 'if',
            },
            {
              depth: 1,
              value: 'Toggle',
              heading: 'toggle',
            },
            {
              depth: 1,
              value: 'Switch',
              heading: 'switch',
            },
            {
              depth: 1,
              value: 'props',
              heading: 'props',
            },
          ],
        },
        title: 'Fork',
        Routes: [require('./TitleWrapper.jsx').default],
        _title: 'flicker - Fork',
        _title_default: 'flicker',
      },
      {
        path: '/utils/portal',
        component: require('../docs/utils/portal/portal.md').default,
        exact: true,
        meta: {
          group: {
            path: '/utils',
            title: '工具',
            order: 1,
          },
          title: 'Portal - 传送门',
          slugs: [
            {
              depth: 1,
              value: '基础示例',
              heading: '基础示例',
            },
            {
              depth: 1,
              value: '指定namespace',
              heading: '指定namespace',
            },
            {
              depth: 1,
              value: 'props',
              heading: 'props',
            },
          ],
        },
        title: 'Portal - 传送门',
        Routes: [require('./TitleWrapper.jsx').default],
        _title: 'flicker - Portal - 传送门',
        _title_default: 'flicker',
      },
      {
        path: '/view/article-box',
        component: require('../docs/view/article-box/article-box.md').default,
        exact: true,
        meta: {
          group: {
            path: '/view',
            title: '展示组件',
            order: 1,
          },
          title: 'ArticleBox - 富文本盒子',
          slugs: [
            {
              depth: 1,
              value: '示例',
              heading: '示例',
            },
            {
              depth: 1,
              value: 'props',
              heading: 'props',
            },
          ],
        },
        title: 'ArticleBox - 富文本盒子',
        Routes: [require('./TitleWrapper.jsx').default],
        _title: 'flicker - ArticleBox - 富文本盒子',
        _title_default: 'flicker',
      },
      {
        path: '/view/carousel',
        component: require('../docs/view/carousel/carousel.md').default,
        exact: true,
        meta: {
          group: {
            path: '/view',
            title: '展示组件',
            order: 1,
          },
          title: 'Carousel - 轮播',
          slugs: [
            {
              depth: 1,
              value: '基础示例',
              heading: '基础示例',
            },
            {
              depth: 1,
              value: '纵向轮播',
              heading: '纵向轮播',
            },
            {
              depth: 1,
              value: '手动控制',
              heading: '手动控制',
            },
            {
              depth: 1,
              value: 'props',
              heading: 'props',
            },
            {
              depth: 1,
              value: 'ref',
              heading: 'ref',
            },
          ],
        },
        title: 'Carousel - 轮播',
        Routes: [require('./TitleWrapper.jsx').default],
        _title: 'flicker - Carousel - 轮播',
        _title_default: 'flicker',
      },
      {
        path: '/view/count-down',
        component: require('../docs/view/count-down/count-down.md').default,
        exact: true,
        meta: {
          group: {
            path: '/view',
            title: '展示组件',
            order: 1,
          },
          title: 'CountDown - 倒计时',
          slugs: [
            {
              depth: 1,
              value: '示例',
              heading: '示例',
            },
            {
              depth: 1,
              value: '自定义格式',
              heading: '自定义格式',
            },
            {
              depth: 1,
              value: 'props',
              heading: 'props',
            },
          ],
        },
        title: 'CountDown - 倒计时',
        Routes: [require('./TitleWrapper.jsx').default],
        _title: 'flicker - CountDown - 倒计时',
        _title_default: 'flicker',
      },
      {
        path: '/base',
        meta: {
          order: 1,
        },
        exact: true,
        redirect: '/base/button',
        _title: 'flicker',
        _title_default: 'flicker',
      },
      {
        path: '/feedback',
        meta: {},
        exact: true,
        redirect: '/feedback/message',
        _title: 'flicker',
        _title_default: 'flicker',
      },
      {
        path: '/utils',
        meta: {
          order: 1,
        },
        exact: true,
        redirect: '/utils/fork',
        _title: 'flicker',
        _title_default: 'flicker',
      },
      {
        path: '/view',
        meta: {
          order: 1,
        },
        exact: true,
        redirect: '/view/article-box',
        _title: 'flicker',
        _title_default: 'flicker',
      },
      {
        component: () =>
          React.createElement(
            require('C:/Users/Administrator/Desktop/flicker/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src', hasRoutesInConfig: false },
          ),
        _title: 'flicker',
        _title_default: 'flicker',
      },
    ],
    title: 'flicker',
    _title: 'flicker',
    _title_default: 'flicker',
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return <Router history={history}>{renderRoutes(routes, props)}</Router>;
  }
}
