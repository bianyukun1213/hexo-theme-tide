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
        const bgiLight = hexo.theme.config?.side_bar_background_image?.light ?? '';
        const bgiDark = hexo.theme.config?.side_bar_background_image?.dark ?? '';
        cssSrc = cssSrc.replace(new RegExp('<TIDE_BACKGROUND_IMAGE_SIDE_BAR_LIGHT>', 'g'), bgiLight);
        cssSrc = cssSrc.replace(new RegExp('<TIDE_BACKGROUND_IMAGE_SIDE_BAR_DARK>', 'g'), bgiDark);
        const fonts = hexo.theme.config?.fonts ?? {
            global: "",
            site_title: "",
            prose: "",
            code: ""
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
