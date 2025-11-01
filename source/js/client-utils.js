'use strict';

window.tideClientUtils = {
    throttle: function (fn, delay = 200) {
        let lastTime = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastTime >= delay) {
                lastTime = now;
                fn.apply(this, args);
            }
        }
    },
    debounce: function (fn, delay = 200, immediate = false) {
        let timeout;
        return function (...args) {
            const context = this;
            const later = () => {
                timeout = null;
                if (!immediate) fn.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, delay);
            if (callNow) fn.apply(context, args);
        };
    },
    throttleDebounce: function (fn, delay = 200, mustRunDelay = 500) {
        let timeout;
        let lastExec = 0;
        return function (...args) {
            const context = this;
            const now = Date.now();
            clearTimeout(timeout);
            if (now - lastExec >= mustRunDelay) {
                fn.apply(context, args);
                lastExec = now;
            } else {
                timeout = setTimeout(() => {
                    fn.apply(context, args);
                    lastExec = Date.now();
                }, delay);
            }
        };
    },
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
    // isPhoneNumber: function (num) {
    //     if (!isString(num))
    //         return false;
    //     return /^1[3456789]\d{9}$/.test(num);
    // },
    isUrl: function (text) {
        if (!isString(text))
            return false;
        return /^(?:(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*)|(?:\/|\.{1,2}\/)[^\s]*$/i.test(text);
    },
    isMobileUserAgent: function (ua) {
        return !!ua.match(
            /(phone|pad|pod|Mobile|iPhone|iPad|iPod|ios|Android|Windows Phone|Symbian|BlackBerry|WebOS|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG)/i
        );
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
