'use strict';

function isNumber(num) {
    return typeof num === 'number';
}

function isInteger(obj) {
    return isNumber(obj) ? obj % 1 === 0 : false;
}

function isString(str) {
    return typeof str === 'string';
}

function isBool(bool) {
    return Boolean(bool);
}

function isArray(array) {
    return array instanceof Array;
}

function isPlainObject(obj) {
    if (typeof obj !== 'object' || obj === null) return false;
    let proto = obj;
    while (Object.getPrototypeOf(proto) !== null)
        proto = Object.getPrototypeOf(proto);
    return Object.getPrototypeOf(obj) === proto;
}

function isEmptyObject(obj) {
    return JSON.stringify(obj) === '{}';
}

function isPhoneNumber(num) {
    return /^1[3456789]\d{9}$/.test(num);
}

function unixTimestampToDate(ts) {
    return new Date(ts);
}

function toCamelCase(name) {
    name = name.trim('_');
    name = name.replace(name[0], name[0].toLowerCase());
    return name.replace(/\_(\w)/g, (all, letter) => {
        return letter.toUpperCase();
    });
}

function toUnderScoreCase(name) {
    name = name.replace(name[0], name[0].toLowerCase());
    return name.replace(/([A-Z])/g, '_$1').toLowerCase();
}

function underScoreCaseObjToCamelCaseObj(uSCObj) {
    if (!isPlainObject(uSCObj))
        // return {};
        throw `转换失败，不是 plain object：${cCObj}。`;
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
}

function camelCaseObjToUnderScoreCaseObj(cCObj) {
    if (!isPlainObject(cCObj))
        // return {};
        throw `转换失败，不是 plain object：${cCObj}。`;
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
}

module.exports = {
    isNumber,
    isInteger,
    isString,
    isBool,
    isArray,
    isPlainObject,
    isEmptyObject,
    isPhoneNumber,
    unixTimestampToDate,
    toCamelCase,
    toUnderScoreCase,
    underScoreCaseObjToCamelCaseObj,
    camelCaseObjToUnderScoreCaseObj
};
