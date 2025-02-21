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
    isPhoneNumber,
    isUrl,
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
        isPhoneNumber,
        isUrl,
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
    return `<meta name="generator" content="hexo-theme-tide ${getTideVersion()}">`;
});

hexo.extend.helper.register('meta_tide_client_ctx', function (tideCtx) {
    let ctx = {};
    ctx.interactions = tideCtx.interactions;
    if (ctx.interactions.webmentionjs) {
        ctx.interactions.webmentionjs.i18n = {};
        const i18nStrings = hexo.theme.i18n.get(tideCtx.language);
        for (const i18nKey in i18nStrings)
            if (Object.prototype.hasOwnProperty.call(i18nStrings, i18nKey) && i18nKey.startsWith('interactions.webmentionjs.i18n.'))
                ctx.interactions.webmentionjs.i18n[i18nKey.replace('interactions.webmentionjs.i18n.', '')] = i18nStrings[i18nKey];
    }
    ctx.search_db_path = tideCtx.search_db_path;
    return `<meta name="tide-client-ctx" content="${encodeURIComponent(JSON.stringify(ctx))}">`;
});
