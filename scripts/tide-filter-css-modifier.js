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
        const colors = hexo.theme.config?.colors ?? {};
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
        const bgiLightLtr = hexo.theme.config?.side_bar_background_image?.light?.ltr ?? '';
        const bgiLightRtl = hexo.theme.config?.side_bar_background_image?.light?.rtl ?? '';
        const bgSizeLight = hexo.theme.config?.side_bar_background_image?.light?.size ?? '';
        const bgPosLight = hexo.theme.config?.side_bar_background_image?.light?.position ?? '';
        const bgRepLight = hexo.theme.config?.side_bar_background_image?.light?.repeat ?? '';
        const bgAttLight = hexo.theme.config?.side_bar_background_image?.light?.attachment ?? '';
        cssSrc = cssSrc
            .replace(new RegExp('<TIDE_BACKGROUND_IMAGE_SIDE_BAR_LIGHT_LTR>', 'g'), bgiLightLtr)
            .replace(new RegExp('<TIDE_BACKGROUND_IMAGE_SIDE_BAR_LIGHT_RTL>', 'g'), bgiLightRtl)
            .replace(new RegExp('<TIDE_BACKGROUND_SIZE_SIDE_BAR_LIGHT>', 'g'), bgSizeLight)
            .replace(new RegExp('<TIDE_BACKGROUND_POSITION_SIDE_BAR_LIGHT>', 'g'), bgPosLight)
            .replace(new RegExp('<TIDE_BACKGROUND_REPEAT_SIDE_BAR_LIGHT>', 'g'), bgRepLight)
            .replace(new RegExp('<TIDE_BACKGROUND_ATTACHMENT_SIDE_BAR_LIGHT>', 'g'), bgAttLight);
        const bgiDarkLtr = hexo.theme.config?.side_bar_background_image?.dark?.ltr ?? '';
        const bgiDarkRtl = hexo.theme.config?.side_bar_background_image?.dark?.rtl ?? '';
        const bgSizeDark = hexo.theme.config?.side_bar_background_image?.dark?.size ?? '';
        const bgPosDark = hexo.theme.config?.side_bar_background_image?.dark?.position ?? '';
        const bgRepDark = hexo.theme.config?.side_bar_background_image?.dark?.repeat ?? '';
        const bgAttDark = hexo.theme.config?.side_bar_background_image?.dark?.attachment ?? '';
        cssSrc = cssSrc
            .replace(new RegExp('<TIDE_BACKGROUND_IMAGE_SIDE_BAR_DARK_LTR>', 'g'), bgiDarkLtr)
            .replace(new RegExp('<TIDE_BACKGROUND_IMAGE_SIDE_BAR_DARK_RTL>', 'g'), bgiDarkRtl)
            .replace(new RegExp('<TIDE_BACKGROUND_SIZE_SIDE_BAR_DARK>', 'g'), bgSizeDark)
            .replace(new RegExp('<TIDE_BACKGROUND_POSITION_SIDE_BAR_DARK>', 'g'), bgPosDark)
            .replace(new RegExp('<TIDE_BACKGROUND_REPEAT_SIDE_BAR_DARK>', 'g'), bgRepDark)
            .replace(new RegExp('<TIDE_BACKGROUND_ATTACHMENT_SIDE_BAR_DARK>', 'g'), bgAttDark);
        const fonts = hexo.theme.config?.fonts ?? {
            global: "",
            site_title: "",
            site_subtitle: "",
            prose: ""
            // code: "" 由 prism.js 指定，否则可能出现行号对不上的问题。
        };
        for (const fontKey in fonts) {
            if (Object.prototype.hasOwnProperty.call(fonts, fontKey)) {
                const fontValue = fonts[fontKey];
                cssSrc = cssSrc.replace(new RegExp(getFontPlaceholder(fontKey), 'g'), fontValue);
            }
        }
    }
    return cssSrc;
}, hexo.theme.config?.css_modifier?.priority ?? 5);
