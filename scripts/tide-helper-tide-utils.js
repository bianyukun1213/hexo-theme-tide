'use strict';

const {
    getTideVersion,
    isNumber,
    isInteger,
    isString,
    isBoolean,
    isArray,
    isPlainObject,
    isEmptyObject,
    isFunction,
    // isPhoneNumber,
    isUrl,
    isMobileUserAgent,
    deepClone,
    deepMergeObj,
    unixTimestampToDate,
    toCamelCase,
    toUnderScoreCase,
    underScoreCaseObjToCamelCaseObj,
    camelCaseObjToUnderScoreCaseObj,
    extractHostFromUrl
} = require('./tide-utils.js');

const scriptName = 'tide-helper-tide-utils';
hexo.extend.helper.register('tide_utils', function () {
    return {
        getTideVersion,
        isNumber,
        isInteger,
        isString,
        isBoolean,
        isArray,
        isPlainObject,
        isEmptyObject,
        isFunction,
        // isPhoneNumber,
        isUrl,
        isMobileUserAgent,
        deepClone,
        deepMergeObj,
        unixTimestampToDate,
        toCamelCase,
        toUnderScoreCase,
        underScoreCaseObjToCamelCaseObj,
        camelCaseObjToUnderScoreCaseObj,
        extractHostFromUrl
    };
});

hexo.extend.helper.register('meta_generator_tide', function () {
    if (hexo.config.meta_generator)
        return `<meta name="generator" content="hexo-theme-tide ${getTideVersion()}">`;
    else
        return '';
});

hexo.extend.helper.register('meta_tide_client_ctx', function (tideCtx) {
    let ctx = {};
    ctx.progress_marker = tideCtx.progress_marker;
    ctx.search_db_path = tideCtx.search_db_path;
    ctx.interactions = tideCtx.interactions;
    if (ctx.interactions.webmentionjs) {
        ctx.interactions.webmentionjs.i18n = {};
        const i18nStrings = hexo.theme?.i18n.get(tideCtx.language);
        for (const i18nKey in i18nStrings)
            if (Object.prototype.hasOwnProperty.call(i18nStrings, i18nKey) && i18nKey.startsWith('interactions.webmentionjs.i18n.'))
                ctx.interactions.webmentionjs.i18n[i18nKey.replace('interactions.webmentionjs.i18n.', '')] = i18nStrings[i18nKey];
    }
    return `<meta name="tide-client-ctx" content="${encodeURIComponent(JSON.stringify(ctx))}">`;
});

hexo.extend.helper.register('parse_cdn_config', function (resName, cdnConfig) {
    if (resName in cdnConfig) {
        return {
            href: cdnConfig[resName].href ?? null,
            src: cdnConfig[resName].src ?? null,
            integrity: cdnConfig[resName].integrity ?? null,
            crossorigin: cdnConfig[resName].crossorigin ?? null,
            referrerpolicy: cdnConfig[resName].referrerpolicy ?? null
        };
    }
    return {};
});

hexo.extend.helper.register('generate_meta_links', function (metaLinksConfig) {
    let res = [];
    for (const metaLink of metaLinksConfig) {
        let str = `<link rel="${metaLink.rel}" href="${metaLink.href}"`;
        if (metaLink.integrity)
            str += ` integrity="${metaLink.integrity}"`;
        if (metaLink.crossorigin)
            str += ` crossorigin="${metaLink.crossorigin}"`;
        if (metaLink.referrerpolicy)
            str += ` referrerpolicy="${metaLink.referrerpolicy}"`;
        str += '>'
        res.push(str);
    }
    return res.join('\n');
});
