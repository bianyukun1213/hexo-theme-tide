'use strict';

const scriptName = 'tide-filter-page-modifier';
hexo.extend.filter.register('after_post_render', function (page) {
    let pgContent = page.content;
    // 代码块锁定 ltr 布局，也可在 uno.config.ts 中通过样式定制实现。出于一致性考量，应通过 HTML 属性实现。但可能有潜在的兼容性问题，比如某个插件修改了 pre 的结构。因此选择 CSS 方式。
    // pgContent = pgContent.replace(/<pre (class="(?:line-numbers )?language-[a-z]+")( data-language="\w+")?>/gm, '<pre $1$2 dir="ltr">');
    // pgContent = pgContent.replace(/<pre class="((?:line-numbers )?language-[a-z]+)"(?: data-language="\w+")?>/gm, '<pre class="$1 not-prose">');
    // pgContent = pgContent.replace(/<code class="(language-\w+)">/gm, '<code class="$1 not-prose">');
    page.content = pgContent;
    return page;
}, hexo.theme.config?.page_modifier?.priority ?? 5);
