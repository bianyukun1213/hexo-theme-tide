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
    out.direction = theme.direction === 'rtl' ? 'rtl' : 'ltr';
    if (isString(page.direction))
        if (page.direction === 'rtl')
            out.direction = 'rtl';
        else
            out.direction = 'ltr';
    out.meta_links = theme?.meta_links ?? [];
    out.microformats2 = theme?.microformats2?.enable ?? false;
    // 对象的合并：
    // key 都是固定的话，可以 deepMerge 合并，页面的优先级最高，页面没有的会有配置值和默认值兜底。
    // key 可以自定义的话，就不 deepMerge，而是发现页面有就取页面，否则发现配置有就取配置。如果 deepMerge 的话，配置有但用户想页面没有，也去不掉。
    out.site_h_card = {
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
        out.site_h_card = deepMergeObj(out.site_h_card, themeHCard);
        // 实际生成 HTML 结构时，h_card 是单独的。
        if (out.site_h_card.p_name === '')
            out.site_h_card.p_name = out.author;
        if (out.site_h_card.p_nickname === '')
            out.site_h_card.p_nickname = out.author;
        let pageHCard;
        try {
            pageHCard = page?.h_card ?? {};
        } catch (error) {
            pageHCard = {};
        }
        out.page_h_card = deepMergeObj(out.site_h_card, pageHCard);
        if (out.page_h_card.p_name === '')
            out.page_h_card.p_name = out.author;
        if (out.page_h_card.p_nickname === '')
            out.page_h_card.p_nickname = out.author;
    }
    out.navigation = theme?.navigation ?? {};
    out.icp_record = theme?.icp_record ?? {};
    // 上为主题配置，下为页面配置。
    out.page_title = page?.title ?? ''; // 有些内置页面此项为空，需单独处理。

    // out.languages = site?.data?.language_map[page.path] ?? {};
    // if (page.languages)
    //     out.languages = page.languages;
    out.languages = {};
    if (page.languages)
        out.languages = page.languages;
    else if (site?.data?.language_map)
        out.languages = site.data.language_map[page.path]?.languages ?? {};
    // out.languages = site?.data?.language_map;

    out.copyright = theme?.copyright?.default ?? ''; // 主题配置中只是预置键值，具体还要看页面，所以认为是页面配置。
    if (page.copyright)
        if (theme.copyright && page.copyright in theme.copyright)
            out.copyright = theme.copyright[page.copyright];
        else
            out.copyright = page.copyright;
    out.syndications = page?.syndications ?? [];
    // page: ["webmentions", "twikoo"] or false
    // theme: enabel: ["webmentions", "twikoo"] webmentions: xxx twikoo: xxx
    // out: {webmentions: xxx, twikoo: xxx} or false
    out.comments = {};
    if (isArray(page.comments)) {
        if (page.comments.includes('webmentions'))
            out.comments.webmentions = theme?.comments?.webmentions ?? {};
        if (page.comments.includes('twikoo'))
            out.comments.twikoo = theme?.comments?.twikoo ?? {};
    } else if (page.comments === true) {
        if (theme?.comments?.enable?.includes('webmentions'))
            out.comments.webmentions = theme.comments?.webmentions ?? {};
        if (theme?.comments?.enable?.includes('twikoo'))
            out.comments.twikoo = theme.comments?.twikoo ?? {};
    } else if (page.comments === false) {
        out.comments = false;
    }
    else if (isArray(theme?.comments?.enable)) {
        if (theme.comments.enable.includes('webmentions'))
            out.comments.webmentions = theme.comments?.webmentions ?? {};
        if (theme.comments.enable.includes('twikoo'))
            out.comments.twikoo = theme.comments?.twikoo ?? {};
    }
    else {
        out.comments = false;
    }



    // 插件适配。
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
