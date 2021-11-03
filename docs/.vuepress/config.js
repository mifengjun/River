module.exports = {
  port: "8080",
  dest: "docs/.vuepress/dist",
  base: "/",
  // 是否开启默认预加载js
  shouldPrefetch: (file, type) => {
      return false;
  },
  // webpack 配置 https://vuepress.vuejs.org/zh/config/#chainwebpack
  chainWebpack: config => {
      if (process.env.NODE_ENV === 'production') {
          const dateTime = new Date().getTime();

          // 清除js版本号
          config.output.filename('assets/js/cg-[name].js?v=' + dateTime).end();
          config.output.chunkFilename('assets/js/cg-[name].js?v=' + dateTime).end();

          // 清除css版本号
          config.plugin('mini-css-extract-plugin').use(require('mini-css-extract-plugin'), [{
              filename: 'assets/css/[name].css?v=' + dateTime,
              chunkFilename: 'assets/css/[name].css?v=' + dateTime
          }]).end();

      }
  },
  markdown: {
      lineNumbers: true,
      externalLinks: {
          target: '_blank', rel: 'noopener noreferrer'
      }
  },
  locales: {
      "/": {
          lang: "zh-CN",
          title: "River 江河",
          description: "积少成多，汇聚江河。"
      }
  },
  head: [
      // ico
      ["link", {rel: "icon", href: `/favicon.ico`}],
      // meta
      ["meta", {name: "robots", content: "all"}],
      ["meta", {name: "author", content: "米凤君"}],
      ["meta", {"http-equiv": "Cache-Control", content: "no-cache, no-store, must-revalidate"}],
      ["meta", {"http-equiv": "Pragma", content: "no-cache"}],
      ["meta", {"http-equiv": "Expires", content: "0"}],
      ["meta", {
          name: "keywords",
          content: "river,米凤君,设计模式,虚拟机"
      }],
      ["meta", {name: "apple-mobile-web-app-capable", content: "yes"}],
      ['script',
          {
              charset: 'utf-8',
              async: 'async',
              // src: 'https://code.jquery.com/jquery-3.5.1.min.js',
              src: '/js/jquery.min.js',
          }],
      ['script',
          {
              charset: 'utf-8',
              async: 'async',
              src: '/js/fingerprint2.min.js',
          }],
      ['script',
          {
              charset: 'utf-8',
              async: 'async',
              src: 'https://s9.cnzz.com/z_stat.php?id=1278232949&web_id=1278232949',
          }],
      // 添加百度统计
      ["script", {},
          `
            var _hmt = _hmt || [];
            (function() {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?e0d604d5dea105bdeffb878e1b5c2b0f";
                var s = document.getElementsByTagName("script")[0]; 
                s.parentNode.insertBefore(hm, s);
            })();
          `
      ]
  ],
  plugins: [
      [
          {globalUIComponents: ['LockArticle']}
      ],
      // ['@vssue/vuepress-plugin-vssue', {
      //     platform: 'github-v3', //v3的platform是github，v4的是github-v4
      //     // 其他的 Vssue 配置
      //     owner: 'fuzhengwei', //github账户名
      //     repo: 'CodeGuide', //github一个项目的名称
      //     clientId: 'df8beab2190bec20352a',//注册的Client ID
      //     clientSecret: '7eeeb4369d699c933f02a026ae8bb1e2a9c80e90',//注册的Client Secret
      //     autoCreateIssue: true // 自动创建评论，默认是false，最好开启，这样首次进入页面的时候就不用去点击创建评论的按钮了。
      // }
      // ],
      // ['@vuepress/back-to-top', true], replaced with inject page-sidebar
      ['@vuepress/medium-zoom', {
          selector: 'img:not(.nozoom)',
          // See: https://github.com/francoischalifour/medium-zoom#options
          options: {
              margin: 16
          }
      }],
      // https://v1.vuepress.vuejs.org/zh/plugin/official/plugin-pwa.html#%E9%80%89%E9%A1%B9
      // ['@vuepress/pwa', {
      //     serviceWorker: true,
      //     updatePopup: {
      //         '/': {
      //             message: "发现新内容可用",
      //             buttonText: "刷新"
      //         },
      //     }
      // }],
      // see: https://vuepress.github.io/zh/plugins/copyright/#%E5%AE%89%E8%A3%85
      // ['copyright', {
      //     noCopy: false, // 允许复制内容
      //     minLength: 100, // 如果长度超过 100 个字符
      //     authorName: "https://bugstack.cn",
      //     clipboardComponent: "请注明文章出处, [bugstack虫洞栈](https://bugstack.cn)"
      // }],
      // see: https://github.com/ekoeryanto/vuepress-plugin-sitemap
      // ['sitemap', {
      //     hostname: 'https://bugstack.cn'
      // }],
      // see: https://github.com/IOriens/vuepress-plugin-baidu-autopush
      ['vuepress-plugin-baidu-autopush', {}],
      // see: https://github.com/znicholasbrown/vuepress-plugin-code-copy
      ['vuepress-plugin-code-copy', {
          align: 'bottom',
          color: '#3eaf7c',
          successText: '@mi: 代码已经复制到剪贴板'
      }],
      // see: https://github.com/tolking/vuepress-plugin-img-lazy
      ['img-lazy', {}],
      ["vuepress-plugin-tags", {
          type: 'default', // 标签预定义样式
          color: '#42b983',  // 标签字体颜色
          border: '1px solid #e2faef', // 标签边框颜色
          backgroundColor: '#f0faf5', // 标签背景颜色
          selector: '.page .content__default h1' // ^v1.0.1 你要将此标签渲染挂载到哪个元素后面？默认是第一个 H1 标签后面；
      }],
      // https://github.com/lorisleiva/vuepress-plugin-seo
      ["seo", {
          siteTitle: (_, $site) => $site.title,
          title: $page => $page.title,
          description: $page => $page.frontmatter.description,
          author: (_, $site) => $site.themeConfig.author,
          tags: $page => $page.frontmatter.tags,
          // twitterCard: _ => 'summary_large_image',
          type: $page => 'article',
          url: (_, $site, path) => ($site.themeConfig.domain || '') + path,
          image: ($page, $site) => $page.frontmatter.image && (($site.themeConfig.domain && !$page.frontmatter.image.startsWith('http') || '') + $page.frontmatter.image),
          publishedAt: $page => $page.frontmatter.date && new Date($page.frontmatter.date),
          modifiedAt: $page => $page.lastUpdated && new Date($page.lastUpdated),
      }]
  ],
  themeConfig: {
      docsRepo: "mifengjun/river",
      // 编辑文档的所在目录
      docsDir: 'docs',
      // 文档放在一个特定的分支下：
      docsBranch: 'master',
      logo: "/favicon.ico",
      editLinks: true,
      sidebarDepth: 2,
      //smoothScroll: true,
      locales: {
          "/": {
              label: "简体中文",
              selectText: "Languages",
              editLinkText: "在 GitHub 上编辑此页",
              lastUpdated: "上次更新",
              nav: [
                  {
                      text: '导读', link: '/posts/index/nav.md'
                  },
                  {
                      text: 'Java',
                      items: [
                          {
                              text: 'JVM',
                              link: '/posts/java/jvm/1. 运行时数据区域.md'
                          }
                      ]
                  },
                  {
                      text: '关于',link: '/posts/about/about-me.md'
                  },
                  {
                      text: 'Github',
                      link: 'https://github.com/mifengjun'
                  }
              ],
              sidebar: {
                  //"/posts/about/": about(),
                  "/posts/index/": siteNav(),
                  "/posts/java/jvm/": jvm()
              }
          }
      }
  }
};
function jvm() {
  return [{
        title: "JVM 目录",
        collapsable: false,
        sidebarDepth: 0,
        children: [
            "1. 运行时数据区域",
            "2. 对象的创建与访问",
            "3. 垃圾回收",
            "4. 垃圾收集算法",
            "5. GC 原理",
            "6. 垃圾收集器",
            "7. class 文件",
            "8. 类的生命周期",
            "9. 虚拟机编译原理"

        ]
    }]
}
function about() {
  return [
    {
        title: "关于",
        collapsable: false,
        sidebarDepth: 2,
        children: [
            "about-me.md"
        ]
    }
]
}

function siteNav() {
  return [
      {
          title: "阅读指南",
          collapsable: false,
          sidebarDepth: 2,
          children: [
              "nav.md"
          ]
      }
  ]
}


