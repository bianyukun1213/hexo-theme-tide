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
    isPhoneNumber,
    deepClone,
    deepMergeObj,
    unixTimestampToDate,
    toCamelCase,
    toUnderScoreCase,
    underScoreCaseObjToCamelCaseObj,
    camelCaseObjToUnderScoreCaseObj
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
        isPhoneNumber,
        deepClone,
        deepMergeObj,
        unixTimestampToDate,
        toCamelCase,
        toUnderScoreCase,
        underScoreCaseObjToCamelCaseObj,
        camelCaseObjToUnderScoreCaseObj
    };
});

hexo.extend.helper.register('meta_generator_tide', () => {
    return `<meta name="generator" content="hexo-theme-tide ${getTideVersion()}">`;
});
