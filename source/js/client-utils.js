'use strict';

const clientUtils = {
    isNumber: function (num) {
        return typeof num === 'number';
    },
    isInteger: function (obj) {
        return isNumber(obj) ? obj % 1 === 0 : false;
    },
    isString: function (str) {
        return typeof str === 'string';
    },
    isBoolean: function (bool) {
        return Boolean(bool);
    },
    isArray: function (array) {
        return array instanceof Array;
    },
    isPlainObject: function (obj) {
        if (typeof obj !== 'object' || obj === null) return false;
        let proto = obj;
        while (Object.getPrototypeOf(proto) !== null)
            proto = Object.getPrototypeOf(proto);
        return Object.getPrototypeOf(obj) === proto;
    },
    isEmptyObject: function (obj) {
        return JSON.stringify(obj) === '{}';
    },
    isFunction: function (fun) {
        return typeof fun === 'function';
    },
    isPhoneNumber: function (num) {
        if (!isString(num))
            return false;
        return /^1[3456789]\d{9}$/.test(num);
    },
    isUrl: function (text) {
        if (!isString(text))
            return false;
        return /^(?:(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*)|(?:\/|\.{1,2}\/)[^\s]*$/i.test(text);
    },
    deepClone: function (obj) {
        return structuredClone(obj);
    },
    deepMergeObj: function (obj, ...source) {
        if (!isPlainObject(obj))
            throw `deepMergeObj failed, target is not a plain object: ${obj} .`;
        obj = deepClone(obj);
        if (source.length === 0)
            return obj;
        for (const key in source[0]) {
            if (source[0].hasOwnProperty(key)) {
                const element = source[0][key];
                if (isPlainObject(element) && isPlainObject(obj[key]))
                    obj[key] = deepMergeObj(obj[key], element);
                else if (element !== null && typeof element !== 'undefined') // 数组也不合并，而是直接替换。
                    obj[key] = deepClone(element);
            }
        }
        if (source.length === 1)
            return obj;
        else
            return deepMergeObj(obj, source.slice(1, source.length - 1));
    },
    unixTimestampToDate: function (ts) {
        return new Date(ts);
    },
    toCamelCase: function (name) {
        name = name.trim('_');
        name = name.replace(name[0], name[0].toLowerCase());
        return name.replace(/\_(\w)/g, (all, letter) => {
            return letter.toUpperCase();
        });
    },
    toUnderScoreCase: function (name) {
        name = name.replace(name[0], name[0].toLowerCase());
        return name.replace(/([A-Z])/g, '_$1').toLowerCase();
    },
    underScoreCaseObjToCamelCaseObj: function (uSCObj) {
        if (!isPlainObject(uSCObj))
            throw `underScoreCaseObjToCamelCaseObj failed, target is not a plain object: ${cCObj} .`;
        let cCObj = {};
        for (const key in uSCObj) {
            // 忽略下划线开头的属性。
            if (uSCObj.hasOwnProperty(key) && !key.startsWith('_')) {
                const element = uSCObj[key];
                if (isPlainObject(element))
                    cCObj[toCamelCase(key)] = underScoreCaseObjToCamelCaseObj(element);
                else
                    cCObj[toCamelCase(key)] = element;
            }
        }
        return cCObj;
    },
    camelCaseObjToUnderScoreCaseObj: function (cCObj) {
        if (!isPlainObject(cCObj))
            throw `camelCaseObjToUnderScoreCaseObj failed, target is not a plain object: ${cCObj} .`;
        let uSCObj = {};
        for (const key in cCObj) {
            // 忽略下划线开头的属性。
            if (cCObj.hasOwnProperty(key) && !key.startsWith('_')) {
                const element = cCObj[key];
                if (isPlainObject(element))
                    uSCObj[toUnderScoreCase(key)] = camelCaseObjToUnderScoreCaseObj(element);
                else
                    uSCObj[toUnderScoreCase(key)] = element;
            }
        }
        return uSCObj;
    },
    extractHostFromUrl: function (url) {
        if (!isString(url))
            return '';
        const match = url.match(/^(?:https?:\/\/)?([^\/:]+(:\d+)?)/);
        return match ? match[1] : '';
    },
};
