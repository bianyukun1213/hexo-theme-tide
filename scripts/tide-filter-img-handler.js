'use strict';

// 为被 p 包裹的 img 去掉包裹，添加标注，标注来源于 title 而非 alt。
hexo.extend.filter.register('after_post_render', function (data) {
    const classCaption = 'tide-image-caption';
    if (data.layout === 'post' || data.layout === 'page') {
        // 含 title，添加 figure 和 figcaption。
        data.content = data.content.replace(/<p\b[^>]*>\s*(<img\b[^>]*\btitle="([^"]+)"[^>]*>)<\/p>/g, `<figure>$1<figcaption class="${classCaption}">$2</figcaption></figure>`);
        // 不含，只添加 figure。
        data.content = data.content.replace(/<p\b[^>]*>\s*(<img\b(?:(?!\btitle=)[^>])*>)<\/p>/g, `<figure>$1</figure>`);
    }
    return data;
}, 5); // todo：优先级设为可配置项。
