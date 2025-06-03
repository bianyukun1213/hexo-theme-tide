'use strict';

function getColorPlaceholder(key, scheme) {
    return `<TIDE_COLOR_${key.toUpperCase()}_${scheme.toUpperCase()}>`;
}

function getFontPlaceholder(key) {
    return `<TIDE_FONT_${key.toUpperCase()}>`;
}

const scriptName = 'tide-filter-css-modifier';
hexo.extend.filter.register('after_render:css', function (cssSrc, local) {
    if (local.path.includes('tide.css')) {
        const descriptionMarker = hexo.theme?.config?.description_marker ?? ': ';
        cssSrc = cssSrc.replace('<TIDE_DESCRIPTION_MARKER>', `"${descriptionMarker.replace(new RegExp('"', 'g'), '\\"')}"`);
        const colors = hexo.theme?.config?.colors ?? {};
        for (const schemeKey in colors) {
            if (Object.prototype.hasOwnProperty.call(colors, schemeKey)) {
                const colorScheme = colors[schemeKey];
                for (const colorKey in colorScheme) {
                    if (Object.prototype.hasOwnProperty.call(colorScheme, colorKey)) {
                        const colorValue = colorScheme[colorKey];
                        cssSrc = cssSrc.replace(new RegExp(getColorPlaceholder(colorKey, schemeKey), 'g'), colorValue);
                    }
                }
            }
        }
        const foLight = hexo.theme?.config?.focus?.light?.outline ?? '';
        const fooLight = hexo.theme?.config?.focus?.light?.outline_offset ?? '';
        const bgiLightLtr = hexo.theme?.config?.sidebar_background_image?.light?.ltr ?? '';
        const bgiLightRtl = hexo.theme?.config?.sidebar_background_image?.light?.rtl ?? '';
        const bgSizeLight = hexo.theme?.config?.sidebar_background_image?.light?.size ?? '';
        const bgPosLight = hexo.theme?.config?.sidebar_background_image?.light?.position ?? '';
        const bgRepLight = hexo.theme?.config?.sidebar_background_image?.light?.repeat ?? '';
        const bgAttLight = hexo.theme?.config?.sidebar_background_image?.light?.attachment ?? '';
        cssSrc = cssSrc
            .replace(new RegExp('<TIDE_FOCUS_OUTLINE_LIGHT>', 'g'), foLight)
            .replace(new RegExp('<TIDE_FOCUS_OUTLINE_OFFSET_LIGHT>', 'g'), fooLight)
            .replace(new RegExp('<TIDE_BACKGROUND_IMAGE_SIDEBAR_LIGHT_LTR>', 'g'), bgiLightLtr)
            .replace(new RegExp('<TIDE_BACKGROUND_IMAGE_SIDEBAR_LIGHT_RTL>', 'g'), bgiLightRtl)
            .replace(new RegExp('<TIDE_BACKGROUND_SIZE_SIDEBAR_LIGHT>', 'g'), bgSizeLight)
            .replace(new RegExp('<TIDE_BACKGROUND_POSITION_SIDEBAR_LIGHT>', 'g'), bgPosLight)
            .replace(new RegExp('<TIDE_BACKGROUND_REPEAT_SIDEBAR_LIGHT>', 'g'), bgRepLight)
            .replace(new RegExp('<TIDE_BACKGROUND_ATTACHMENT_SIDEBAR_LIGHT>', 'g'), bgAttLight);
        const foDark = hexo.theme?.config?.focus?.dark?.outline ?? '';
        const fooDark = hexo.theme?.config?.focus?.dark?.outline_offset ?? '';
        const bgiDarkLtr = hexo.theme?.config?.sidebar_background_image?.dark?.ltr ?? '';
        const bgiDarkRtl = hexo.theme?.config?.sidebar_background_image?.dark?.rtl ?? '';
        const bgSizeDark = hexo.theme?.config?.sidebar_background_image?.dark?.size ?? '';
        const bgPosDark = hexo.theme?.config?.sidebar_background_image?.dark?.position ?? '';
        const bgRepDark = hexo.theme?.config?.sidebar_background_image?.dark?.repeat ?? '';
        const bgAttDark = hexo.theme?.config?.sidebar_background_image?.dark?.attachment ?? '';
        cssSrc = cssSrc
            .replace(new RegExp('<TIDE_FOCUS_OUTLINE_DARK>', 'g'), foDark)
            .replace(new RegExp('<TIDE_FOCUS_OUTLINE_OFFSET_DARK>', 'g'), fooDark)
            .replace(new RegExp('<TIDE_FOCUS_OUTLINE_DARK>', 'g'), bgiLightLtr)
            .replace(new RegExp('<TIDE_BACKGROUND_IMAGE_SIDEBAR_DARK_LTR>', 'g'), bgiDarkLtr)
            .replace(new RegExp('<TIDE_BACKGROUND_IMAGE_SIDEBAR_DARK_RTL>', 'g'), bgiDarkRtl)
            .replace(new RegExp('<TIDE_BACKGROUND_SIZE_SIDEBAR_DARK>', 'g'), bgSizeDark)
            .replace(new RegExp('<TIDE_BACKGROUND_POSITION_SIDEBAR_DARK>', 'g'), bgPosDark)
            .replace(new RegExp('<TIDE_BACKGROUND_REPEAT_SIDEBAR_DARK>', 'g'), bgRepDark)
            .replace(new RegExp('<TIDE_BACKGROUND_ATTACHMENT_SIDEBAR_DARK>', 'g'), bgAttDark);
        const fonts = hexo.theme?.config?.fonts ?? {
            global: '',
            site_title: '',
            site_subtitle: '',
            prose: ''
            // code: '' 由 prism.js 指定，否则可能出现行号对不上的问题。
        };
        for (const fontKey in fonts) {
            if (Object.prototype.hasOwnProperty.call(fonts, fontKey)) {
                const fontValue = fonts[fontKey];
                cssSrc = cssSrc.replace(new RegExp(getFontPlaceholder(fontKey), 'g'), fontValue);
            }
        }
        // UnoCSS 的 preset-wind4 使用的 color-mix in oklch 有偏色问题，替换成 in oklab。
        // 这是临时解决方案。应该通过 PostCSS 在主题样式文件构建时完成，写在这里可能错误替换用户自己的样式。
        cssSrc = cssSrc.replace(new RegExp('in oklch', 'g'), 'in oklab');
    }
    return cssSrc;
}, hexo.theme?.config?.css_modifier?.priority ?? 5);
