'use strict';

const {
    getTideVersion,
    isNumber,
    isInteger,
    isString,
    isBool,
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
        isBool,
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

hexo.extend.helper.register('meta_tide_ctx_client', function (tideCtx) {
    // todo: 精简嵌入到页面的 tideCtx。
    return '<meta name="tide-ctx-client" content="Nothing here, for now. :P">';
    return `<meta name="tide-ctx-client" content="${encodeURIComponent(JSON.stringify(tideCtx))}">`;
});
