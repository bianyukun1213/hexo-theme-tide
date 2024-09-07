'use strict';

const _ = require('lodash');
const {
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
} = require('./tide-utils.js');

// const utils = require('./tide-utils');
// console.info(typeof utils);
// console.info(typeof utils.isNumber)
// console.info(JSON.stringify(utils))



const scriptName = 'tide-helper-config-parser';
// 合并站点、主题、页面和默认的配置，只检查空值不检查类型。
hexo.extend.helper.register('parse_config', (site, config, theme, page) => {
    let out = {};
    out.site_title = config?.title ?? '';
    out.site_subtitle = config?.siteSubtitle ?? '';
    out.description = page?.description ?? config?.description ?? '';
    out.keywords = page?.keywords ?? config?.keywords ?? [];
    out.author = page?.author ?? config?.author ?? '';
    out.language = page?.language ?? page?.lang ?? config?.language;
    // 上为站点配置，下为主题配置。
    out.navigation = theme?.navigation ?? {};
    out.microformats2 = theme?.microformats2?.enable ?? false;
    out.h_card = {
        p_honorific_prefix: '',
        p_name: '',
        p_given_name: '',
        p_additional_name: '',
        p_family_name: '',
        p_honorific_suffix: '',
        p_nickname: '',
        u_photo: '',
        u_uid: [],
        u_email: ''
    };
    if (out.microformats2) {
        let themeHCard;
        try {
            themeHCard = theme?.microformats2?.h_card ?? {};
        } catch (error) {
            themeHCard = {};
        }
        let pageHCard;
        try {
            pageHCard = page?.h_card ?? {};
        } catch (error) {
            pageHCard = {};
        }
        _.assign(out.h_card, themeHCard, pageHCard);
    }
    out.meta_links = theme?.meta_links ?? [];
    out.copyright = '';
    if (page.copyright)
        if (theme.copyright && page.copyright in theme.copyright)
            out.copyright = theme.copyright[page.copyright];
        else
            out.copyright = page.copyright;




    // if(!is)
    // console.log(theme.microformats2.h_card)


    // out.hCard = {
    //     pHonorificPrefix: page?.microformats2?.h_card?.p_honorific_prefix ?? theme?.microformats2?.h_card?.p_honorific_prefix ?? '',
    //     pName: theme?.microformats2?.h_card?.p_name ?? '',
    //     pGivenName: '',
    //     pAdditionalName: '',
    //     pFamilyName: '',
    //     pHonorificSuffix: '',
    //     pNickname: '',
    //     uPhoto: '',
    //     uUid: [],
    //     uEmail: ''
    // };






    out.search_db_path = config?.search?.path;
    out.page_hidden = false;
    if (config?.hide_posts?.enable ?? false) {
        const hidePostsFilter = config?.hide_posts?.filter;
        if (hidePostsFilter in page)
            out.page_hidden = true;
    }
    out.page_encrypted = false;
    if ('encrypt' in config && 'password' in page)
        out.page_encrypted = true;
    return out;
}); // todo：优先级设为可配置项。
