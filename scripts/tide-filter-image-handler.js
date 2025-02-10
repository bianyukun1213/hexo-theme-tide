'use strict';

const scriptName = 'tide-filter-image-handler';
// 为被 p 包裹的 img 去掉包裹，添加标注，标注来源于 title 而非 alt。为图片添加 tabindex。
hexo.extend.filter.register('after_post_render', function (data) {
    const classFigure = 'tide-image-figure';
    const classCaption = 'tide-image-caption';
    if (data.layout === 'post' || data.layout === 'page') {

console.log(data.path)

        // 含 title，添加 figure 和 figcaption。
        data.content = data.content.replace(/<p\b[^>]*>\s*(<img\b[^>]*\btitle="([^"]+)"[^>]*>)<\/p>/g, (match, group1, group2) => {
            console.log('title group1',group1)
            console.log('title group2',group2)
            const modifiedGroup1 = group1.replace('<img', '<img tabindex="0"');
            console.log('title modified group1',modifiedGroup1)
            return `<figure class="${classFigure}">${modifiedGroup1}<figcaption class="${classCaption}">${group2}</figcaption></figure>`;
        });
        // 不含，只添加 figure。
        data.content = data.content.replace(/<p\b[^>]*>\s*(<img\b(?:(?!\btitle=)[^>])*>)<\/p>/g, (match, group1) => {
            console.log('notitle group1',group1)
            const modifiedGroup1 = group1.replace('<img', '<img tabindex="0"');
            console.log('notitle modified group1', modifiedGroup1)
            return `<figure class="${classFigure}">${modifiedGroup1}</figure>`;
        });
    }
    return data;
}, hexo.theme.config?.image_handler?.priority ?? 5);
