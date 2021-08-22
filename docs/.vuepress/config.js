module.exports = {
  base: "/berry-orm/",
  title: "Berry ORM",
  description: "Object Relational Mapping for front-ends",

  themeConfig: {
    search: true,
    repo: "https://github.com/TheNightmareX/berry-orm",
    docsBranch: "develop",
    repoLabel: "GitHub",
    docsDir: "docs",
    editLinks: true,
    displayAllHeaders: true,
    locales: {
      "/en/": {
        selectText: "Languages",
        label: "English",
        lastUpdated: "Last Updated",
        sidebar: [
          {
            title: "Guide",
            collapsable: false,
            children: [
              "/en/guide/introduction",
              "/en/guide/why-is-an-orm-needed",
              "/en/guide/defining-entities",
              "/en/guide/constructing-orm",
              "/en/guide/using-entity-manager",
              "/en/guide/updating-entities",
            ],
          },
          {
            title: "Advanced",
            collapsable: false,
            children: ["/en/advanced/custom-store"],
          },
        ],
      },
      "/zh/": {
        selectText: "语言",
        lable: "简体中文",
        lastUpdated: "最后更新",
        sidebar: [
          {
            title: "指南",
            collapsable: false,
            children: [
              "/zh/guide/introduction",
              "/zh/guide/why-is-an-orm-needed",
              "/zh/guide/defining-entities",
              "/zh/guide/constructing-orm",
              "/zh/guide/using-entity-manager",
              "/zh/guide/updating-entities",
            ],
          },
          {
            title: "进阶",
            collapsable: false,
            children: ["/zh/advanced/custom-store"],
          },
        ],
      },
    },
  },

  locales: {
    "/en/": {
      lang: "en-US",
    },
    "/zh/": {
      lang: "zh-CN",
    },
  },

  plugins: [
    [
      "redirect",
      {
        locales: true,
      },
    ],
  ],
};
