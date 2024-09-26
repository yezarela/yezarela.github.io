import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Codes by Yesarela Ritonga",
  tagline: "Powered by nasi padang and a healthy dose of air putih",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://codethetalk.tech",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "yezarela", // Usually your GitHub org/user name.
  projectName: "yezarela.github.io", // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: false,
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
        sitemap: {
          lastmod: "date",
          changefreq: "weekly",
          priority: 0.5,
          ignorePatterns: ["/tags/**"],
          filename: "sitemap.xml",
          createSitemapItems: async (params) => {
            const { defaultCreateSitemapItems, ...rest } = params;
            const items = await defaultCreateSitemapItems(rest);
            return items.filter((item) => !item.url.includes("/page/"));
          },
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    // Use custom blog plugin
    [
      "./plugins/blog-plugin",
      {
        id: "blog",
        routeBasePath: "/blog",
        path: "./blog",
        showReadingTime: true,
        feedOptions: {
          type: ["rss", "atom"],
          xslt: true,
        },
        // Useful options to enforce blogging best practices
        onInlineTags: "warn",
        onInlineAuthors: "warn",
        onUntruncatedBlogPosts: "warn",
      },
    ],
  ],

  headTags: [
    {
      tagName: "meta",
      attributes: {
        name: "description",
        content: "Powered by nasi padang and a healthy dose of air putih",
      },
    },
  ],

  themeConfig: {
    // SEO: Declare some <meta> tags
    metadata: [
      { name: "keywords", content: "engineering, blog" },
      // {name: 'twitter:card', content: 'summary_large_image'},
    ],
    // Replace with your project's social card
    // image: "img/docusaurus-social-card.jpg",
    colorMode: {
      defaultMode: "dark",
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 5,
    },
    navbar: {
      title: "Home",
      items: [
        { to: "/blog", label: "Blog", position: "left" },
        { to: "/about", label: "About", position: "left" },
        {
          href: "https://github.com/yezarela",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      copyright: `Copyright © ${new Date().getFullYear()}. Built with Docusaurus ❤️`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    sidebar: {
      hideable: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
