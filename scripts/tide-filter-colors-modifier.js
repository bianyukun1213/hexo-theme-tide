'use strict';

const { toUnderScoreCase } = require('./tide-utils.js');

function getPlaceholder(key, scheme) {
    return `<TIDE_COLOR_${toUnderScoreCase(key).toUpperCase()}_${scheme.toUpperCase()}>`;
}

const scriptName = 'tide-filter-colors-modifier';
hexo.extend.filter.register('after_render:css', function (cssSrc, local) {
    if (local.path.includes('tide.css')) {
        const colors = hexo.theme.config?.colors ?? {};
        for (const schemeKey in colors) {
            if (Object.prototype.hasOwnProperty.call(colors, schemeKey)) {
                const colorScheme = colors[schemeKey];
                for (const colorKey in colorScheme) {
                    if (Object.prototype.hasOwnProperty.call(colorScheme, colorKey)) {
                        const colorValue = colorScheme[colorKey];
                        cssSrc = cssSrc.replace(new RegExp(getPlaceholder(colorKey, schemeKey), 'g'), colorValue);
                    }
                }
            }
        }
    }
    return cssSrc;
}, hexo.theme.config?.colors_modifier?.priority ?? 5);
