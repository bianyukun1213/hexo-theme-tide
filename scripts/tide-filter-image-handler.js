'use strict';

const scriptName = 'tide-filter-image-handler';
// 为 img 添加标注，标注来源于 title 而非 alt。为图片添加 tabindex。
hexo.extend.filter.register('after_post_render', function (data) {
    const classFigure = 'tide-image-figure';
    const classCaption = 'tide-image-caption';
    if (data.layout === 'post' || data.layout === 'page') {
        // ![]() 间无空行，多张图片被渲染为一个段落，中间以 br 隔开。
        data.content = data.content.replace(/<p\b[^>]*>([\s\S]*?)<\/p>/g, (match, inner) => {
            if (/^(<img\b[^>]*>(<br\s*\/?>[\s\n]*)*)+$/.test(inner)) {
                return inner.replace(/<img\b([^>]*)>/g, (imgMatch, imgAttrs) => {
                    const titleMatch = imgAttrs.match(/\btitle="([^"]*)"/);
                    const modifiedImg = imgMatch.replace('<img', '<img tabindex="0"');
                    if (titleMatch)
                        return `<figure class="${classFigure}">${modifiedImg}<figcaption class="${classCaption}">${titleMatch[1]}</figcaption></figure>`;
                    return `<figure class="${classFigure}">${modifiedImg}</figure>`;
                }).replace(/<br\s*\/?>/g, '');
            }
            return match;
        });
        // 单图单段落，含标题。
        data.content = data.content.replace(/<(p|div)\b[^>]*>\s*(<img\b[^>]*?\btitle="([^"]+)"[^>]*?>)\s*<\/\1>/gs, (match, group1, group2, group3) => {
            const modifiedGroup2 = group2.replace('<img', '<img tabindex="0"');
            return `<figure class="${classFigure}">${modifiedGroup2}<figcaption class="${classCaption}">${group3}</figcaption></figure>`;
        });
        // 单图单段落，不含标题。
        data.content = data.content.replace(/<(p|div)\b[^>]*>\s*(<img\b(?![^>]*?\btitle="[^"]+")[^>]*?>)\s*<\/\1>/gs, (match, group1, group2) => {
            const modifiedGroup2 = group2.replace('<img', '<img tabindex="0"');
            return `<figure class="${classFigure}">${modifiedGroup2}</figure>`;
        });
    }
    return data;
}, hexo.theme.config?.image_handler?.priority ?? 5);
