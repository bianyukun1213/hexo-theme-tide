'use strict';

const scriptName = 'tide-filter-table-handler';
// 为 table 添加 wrapper，便于使横向溢出显示滚动条。
hexo.extend.filter.register('after_post_render', function (data) {
    if (data.layout === 'post' || data.layout === 'page' || data.layout === 'draft') {
        const nestedTableDetected = /<table[^>]*>[^]*?<table[^>]*>/.test(data.content);
        // 正则表达式无法处理嵌套情况。
        if (nestedTableDetected) {
            const cheerio = require('cheerio');
            const $ = cheerio.load(data.content, {
                scriptingEnabled: false
            }, false); // 避免自动加 html 标签。https://cheerio.js.org/docs/advanced/configuring-cheerio#fragment-mode
            $('table').wrap('<div class="tide-table-wrapper"></div>');
            data.content = $.html();
        } else {
            data.content = data.content.replace(/<table[^>]*>[\s\S]*?<\/table>/g, match => `<div class="tide-table-wrapper">${match}</div>`);
        }
    }
    return data;
}, hexo.theme?.config?.table_handler?.priority ?? 5);
