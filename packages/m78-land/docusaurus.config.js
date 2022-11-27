// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/vsDark");
const ssrTemplate = require("./config/template");

/** @type {import('@docusaurus/types').Config} */
const config = {
  ssrTemplate,
  title: "M78 Land",
  tagline: "front-end library, components, hooks, admin template, and...",
  url: "https://github.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/logo-small.png",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  // organizationName: "m78", // Usually your GitHub org/username.
  // projectName: "m78", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "zh-Hans",
    locales: ["zh-Hans", "en-US"],
  },

  plugins: [
    "@docusaurus/theme-live-codeblock",
    "docusaurus-plugin-sass",
    require.resolve("docusaurus-lunr-search"),
  ],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        pages: {},
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          sidebarCollapsed: false,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/xianjie-li/m78/tree/master/packages/m78-land",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/xianjie-li/m78/tree/master/packages/m78-land",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.scss"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [
        {
          name: "keywords",
          content:
            "M78 front-end library, components, hooks, admin template, and...",
        },
      ],
      navbar: {
        title: "M78 Land",
        logo: {
          alt: "M78 Land Logo",
          src: "img/logo-small.png",
        },
        hideOnScroll: true,
        items: [
          {
            type: "doc",
            docId: "components/start",
            position: "left",
            label: "Components",
          },
          {
            type: "doc",
            docId: "hooks/start",
            position: "left",
            label: "Hooks",
          },
          { to: "/blog", label: "Blog", position: "left" },
          {
            type: "search",
            position: "right",
          },
          {
            href: "https://github.com/xianjie-li/m78",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        // links: [
        //   {
        //     title: "Docs",
        //     items: [
        //       {
        //         label: "Components",
        //         to: "/docs/components",
        //       },
        //       {
        //         label: "Hooks",
        //         to: "/docs/hooks",
        //       },
        //       {
        //         label: "Blog",
        //         to: "/blog",
        //       },
        //     ],
        //   },
        //   {
        //     title: "Community",
        //     items: [
        //       {
        //         label: "GitHub",
        //         href: "https://github.com/xianjie-li/m78",
        //       },
        //       {
        //         label: "Xianjie Li",
        //         href: "https://github.com/xianjie-li",
        //       },
        //     ],
        //   },
        // ],
        copyright: `copyright © ${new Date().getFullYear()} xianjie-li`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
