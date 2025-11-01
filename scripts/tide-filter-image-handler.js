'use strict';

const scriptName = 'tide-filter-image-handler';
// 为 img 添加标注，标注来源于 title 而非 alt。为图片添加 tabindex。
hexo.extend.filter.register('after_post_render', function (data) {
    const maskDefaultTitle = hexo.theme?.config?.image_viewer?.mask_default_title ?? '';
    const btnUnmaskDefaultTitle = hexo.theme?.config?.image_viewer?.btn_unmask_default_title ?? '';
    const classFigure = 'tide-image-figure';
    const classInlineFigure = 'tide-image-inline-figure';
    const classCaption = 'tide-image-caption';
    if (data.layout === 'post' || data.layout === 'page' || data.layout === 'draft') {
        // ![]() 间无空行但末尾有空格，连续多张图片被渲染为一个纯图片段落，中间以 br 隔开，认为等同于单段落中的单图片。
        data.content = data.content.replace(/<p\b[^>]*>([\s\S]*?)<\/p>/g, (match, inner) => {
            if (/^(<img\b[^>]*>(<br\s*\/?>[\s\n]*)*)+$/.test(inner)) {
                return inner.replace(/<img\b([^>]*)>/g, (imgMatch, imgAttrs) => {
                    if (imgMatch.includes('data-no-handling'))
                        return imgMatch;
                    const titleMatch = imgAttrs.match(/\btitle="([^"]*)"/);
                    const modifiedImg = imgMatch.replace('<img', '<img tabindex="0" aria-haspopup="dialog" aria-controls="tide-dialog-image-viewer"');
                    if (titleMatch)
                        return `<figure class="${classFigure}">${modifiedImg}<figcaption class="${classCaption}">${titleMatch[1]}</figcaption></figure>`;
                    return `<figure class="${classFigure}">${modifiedImg}</figure>`;
                }).replace(/<br\s*\/?>/g, '');
            }
            return match;
        });
        // 单图单段落，含标题。
        data.content = data.content.replace(/<(p|div)\b[^>]*>\s*(<img\b[^>]*?\btitle="([^"]+)"[^>]*?>)\s*<\/\1>/gs, (match, group1, group2, group3) => {
            if (group2.includes('data-no-handling'))
                return match;
            const modifiedGroup2 = group2.replace('<img', '<img tabindex="0" aria-haspopup="dialog" aria-controls="tide-dialog-image-viewer"');
            return `<figure class="${classFigure}">${modifiedGroup2}<figcaption class="${classCaption}">${group3}</figcaption></figure>`;
        });
        // 单图单段落，不含标题。
        data.content = data.content.replace(/<(p|div)\b[^>]*>\s*(<img\b(?![^>]*?\btitle="[^"]+")[^>]*?>)\s*<\/\1>/gs, (match, group1, group2) => {
            if (group2.includes('data-no-handling'))
                return match;
            const modifiedGroup2 = group2.replace('<img', '<img tabindex="0" aria-haspopup="dialog" aria-controls="tide-dialog-image-viewer"');
            return `<figure class="${classFigure}">${modifiedGroup2}</figure>`;
        });
        // 未处理的（不含 tabindex 的）行内图片，添加 inline-figure 包裹和 tabindex，不添加 figcaption。
        data.content = data.content.replace(/<img(?![^>]*\btabindex\s*=\s*["']?\d+["']?)([^>]*)>/g, (match) => {
            // data.content = data.content.replace(/<img\s+[^>]*>/g, (match) => {
            if (match.includes('data-no-handling'))
                return match;
            return `<span class="${classInlineFigure}">${match.replace('<img', '<img tabindex="0" aria-haspopup="dialog" aria-controls="tide-dialog-image-viewer"')}</span>`;
        });
        // 含有遮罩的图片。
        data.content = data.content.replace(/<img\b[^>]*?\bdata-mask(?:="([^"]*)")?[^>]*?>/g, (match, group1) => {
            let maskTitle = maskDefaultTitle;
            let btnUnmaskTitle = btnUnmaskDefaultTitle;
            if (group1) {
                const maskInfo = group1.split('|');
                if (maskInfo.length === 1) {
                    maskTitle = maskInfo[0];
                } else if (maskInfo.length === 2) {
                    maskTitle = maskInfo[0];
                    btnUnmaskTitle = maskInfo[1];
                }
            }
            // return `<div class="tide-image-mask"><div class="tide-image-mask-controls"><p>${group1}</p><a class="tide-btn-unmask-image" href="javascript:void(0);">显示</a></div></div>${match.replace('tabindex="0"', '')}`;
            // 不需要移除 tabindex，因为给元素设置隐藏（样式实现）后已经无法获取焦点了。
            return `<span class="tide-image-mask"><span class="tide-image-mask-controls"><span>${maskTitle}</span><a class="tide-btn-unmask-image" href="javascript:void(0);" role="button">${btnUnmaskTitle}</a></span></span>${match}`;
        });
    }
    return data;
}, hexo.theme?.config?.image_handler?.priority ?? 5);
