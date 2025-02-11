'use strict';

const scriptName = 'tide-filter-image-handler';
// 为被 p 包裹的 img 去掉包裹，添加标注，标注来源于 title 而非 alt。为图片添加 tabindex。
hexo.extend.filter.register('after_post_render', function (data) {
    const classFigure = 'tide-image-figure';
    const classCaption = 'tide-image-caption';
    if (data.layout === 'post' || data.layout === 'page') {
        // 含 title，添加 figure 和 figcaption。
        data.content = data.content.replace(/<(p|div)\b[^>]*>\s*(<img\b[^>]*?\btitle="([^"]+)"[^>]*?>)\s*<\/\1>/gs, (match, group1, group2, group3) => {
            const modifiedGroup2 = group2.replace('<img', '<img tabindex="0"');
            return `<figure class="${classFigure}">${modifiedGroup2}<figcaption class="${classCaption}">${group3}</figcaption></figure>`;
        });
        // 不含，只添加 figure。
        data.content = data.content.replace(/<(p|div)\b[^>]*>\s*(<img\b(?![^>]*?\btitle="[^"]+")[^>]*?>)\s*<\/\1>/gs, (match, group1, group2) => {
            const modifiedGroup2 = group2.replace('<img', '<img tabindex="0"');
            return `<figure class="${classFigure}">${modifiedGroup2}</figure>`;
        });
    }
    return data;
}, hexo.theme.config?.image_handler?.priority ?? 5);
