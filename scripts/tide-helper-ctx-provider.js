'use strict';

let languageMeta = require('./tide-predefined-language-meta.js');

const moment = require('moment');

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

hexo.on('generateBefore', function () {
    const data = hexo.locals.get('data');
    const { i18n } = hexo.theme;
    if (isPlainObject(data.languages)) {
        for (const langKey in data.languages) {
            if (Object.prototype.hasOwnProperty.call(data.languages, langKey)) {
                const lang = data.languages[langKey];
                if (isPlainObject(lang.meta) && isString(lang.meta.display) && (lang.meta.direction === 'ltr' || lang.meta.direction === 'rtl')) {
                    if (languageMeta[langKey])
                        languageMeta[langKey] = deepMergeObj(languageMeta[langKey], lang.meta);
                    else
                        languageMeta[langKey] = lang.meta;
                    if (isPlainObject(lang.i18n))
                        i18n.set(langKey, deepMergeObj(i18n.get(langKey), lang.i18n));
                }
            }
        }
    }
});

let ctxCache = {};

const scriptName = 'tide-helper-ctx-provider';
// 合并站点、主题、页面和默认的配置。
hexo.extend.helper.register('get_ctx', function (site, config, theme, page) {
    if (isPlainObject(ctxCache[page.path]))
        return ctxCache[page.path];
    // 自定义 meta 匹配
    let availablePageMetaConfs = [];
    let currentPageMetaConf = null;
    const pageMeta = site.data?.page_meta ?? {};
    for (const pageKey of Object.keys(pageMeta)) {
        const pagePathReg = new RegExp(pageKey);
        if (pagePathReg.test(page.path)) {
            let pageMetaConfClone = JSON.parse(JSON.stringify(pageMeta[pageKey]));
            pageMetaConfClone.pathPattern = pagePathReg;
            availablePageMetaConfs.push(pageMetaConfClone);
            // break;
        }
    }
    if (availablePageMetaConfs.length > 0) {
        currentPageMetaConf = {};
        for (const pm of availablePageMetaConfs) {
            currentPageMetaConf = deepMergeObj(currentPageMetaConf, pm);
        }
    }
    let out = {};
    out.site_title = config.title || '';
    out.site_subtitle = config.subtitle || '';
    out.description = page.description || currentPageMetaConf?.description || config.description || '';
    out.keywords = page.keywords ?? currentPageMetaConf?.keywords ?? config.keywords ?? [];
    out.site_author = config.author || '';
    out.language = page.language || page.lang; // 实测 page 会继承 config 的 language，currentPageMetaConf 不会生效。
    if (!out.language)
        out.language = currentPageMetaConf?.language;
    if (!out.language)
        out.language = config.language || '';
    // https://hexo.io/zh-cn/docs/variables#%E9%A1%B5%E9%9D%A2%E5%8F%98%E9%87%8F
    out.per_page = page.per_page ?? config.per_page ?? 10;
    out.total = page.total ?? 0;
    out.current = page.current ?? 0;
    out.current_url = page.current_url || '';
    out.year = page.year ?? 0;
    out.month = page.month ?? 0;
    out.category = page.category || '';
    out.tag = page.tag || '';
    out.meta_generator = config.meta_generator ?? true;
    out.date_format = config.date_format || '';
    out.time_format = config.time_format || '';
    out.site_categories = [];
    if (site.categories?.length) {
        site.categories.forEach((cate) => {
            out.site_categories.push({
                name: cate.name,
                id: cate._id,
                parent: cate.parent || '',
                slug: cate.slug,
                path: cate.path,
                permalink: cate.permalink
            });
        });
    }
    out.site_tags = [];
    if (site.tags?.length) {
        site.tags.forEach((tag) => {
            out.site_tags.push({
                name: tag.name,
                id: tag._id,
                slug: tag.slug,
                path: tag.path,
                permalink: tag.permalink
            });
        });
    }
    // 上为站点配置，下为主题配置。
    out.language_meta = languageMeta;
    if (languageMeta[out.language]) {
        out.site_dir = languageMeta[out.language].direction;
    } else {
        out.site_dir = 'ltr';
    }
    if (isString(theme.dir)) {
        if (theme.dir === 'rtl')
            out.site_dir = 'rtl';
        else
            out.site_dir = 'ltr';
    }
    out.cdn = theme.cdn ?? {};
    out.fonts = theme.fonts ?? {};
    // out.meta_icons = theme.meta_icons ?? {};
    out.meta_links = theme.meta_links ?? [];
    out.microformats2 = theme.microformats2?.enable ?? false;
    // 对象的合并：
    // key 都是固定的话，可以 deepMerge 合并，页面的优先级最高，页面没有的会有配置值和默认值兜底。
    // key 可以自定义的话，就不 deepMerge，而是发现页面有就取页面，否则发现配置有就取配置。如果 deepMerge 的话，配置有但用户想页面没有，也去不掉。
    out.site_h_cards = [];
    out.p_authors = [];
    if (out.microformats2) {
        const blankHCard = {
            p_honorific_prefix: '',
            p_name: '',
            p_given_name: '',
            p_additional_name: '',
            p_family_name: '',
            p_honorific_suffix: '',
            p_nickname: '',
            u_photo: '',
            u_uid: [],
            u_email: '',
            p_note: ''
        };
        const themeHCards = isArray(theme.microformats2.h_cards) ? theme.microformats2.h_cards : [];
        for (const themeHCard of themeHCards)
            if (isPlainObject(themeHCard))
                out.site_h_cards.push(deepMergeObj(blankHCard, themeHCard));
        const pageHCards = isArray(page.p_authors) ? page.p_authors : themeHCards;
        for (const pageHCard of pageHCards)
            if (isPlainObject(pageHCard))
                out.p_authors.push(deepMergeObj(blankHCard, pageHCard));
        // https://microformats.org/wiki/h-entry
        // https://microformats.org/wiki/h-card
        // https://microformats.org/wiki/h-adr
        // https://microformats.org/wiki/h-geo
        const blankPLocation = {
            p_name: '',
            p_street_address: '',
            p_extended_address: '',
            p_locality: '',
            p_region: '',
            p_country_name: '',
            p_latitude: '',
            p_longitude: '',
            p_altitude: ''
        };
        out.p_location = deepMergeObj(blankPLocation, page.p_location ?? {});
    }
    out.open_graph = theme.open_graph ?? { enable: true };
    out.json_ld = theme.json_ld ?? { enable: true, organization_authors: [] };
    // if (!isPlainObject(out.fonts?.web_fonts) || !isBoolean(out.fonts?.web_fonts?.enable) || !isUrl(out.fonts?.web_fonts?.preconnect) || !isUrl(out.fonts?.web_fonts?.css_href)) {
    //     out.fonts.web_fonts = {
    //         enable: false,
    //         preconnect: '',
    //         css_href: ''
    //     };
    // }
    out.navigation = theme.navigation ?? {};
    out.icp_record = theme.icp_record ?? {};
    out.generated_by_hexo_and_theme_tide = theme.generated_by_hexo_and_theme_tide ?? true;
    out.image_viewer = theme.image_viewer ?? {};
    if (!out.mask_default_title) out.mask_default_title = '';
    if (!out.btn_unmask_default_title) out.btn_unmask_default_title = '';
    // 小功能
    out.word_counter = theme.word_counter ?? true;
    out.toc = {};
    out.toc.enable = theme.toc?.enable ?? true;
    out.toc.list_number = theme.toc?.list_number ?? false;
    out.search = theme.search ?? true;
    out.list_separator = theme.list_separator || ', ';
    out.active_item_marker_begin = theme.active_item_marker_begin || '';
    out.active_item_marker_end = theme.active_item_marker_end || '';
    out.description_marker = theme.description_marker || '';
    out.range_marker = theme.range_marker || '';
    out.progress_marker = theme.progress_marker || '';
    // 上为主题配置，下为页面配置。
    out.layout = page.layout || '';
    if (isString(page.dir)) {
        if (page.dir === 'rtl')
            out.page_dir = 'rtl';
        else
            out.page_dir = 'ltr';
    } else if (isString(currentPageMetaConf?.dir)) {
        if (currentPageMetaConf.dir === 'rtl')
            out.page_dir = 'rtl';
        else
            out.page_dir = 'ltr';
    } else {
        out.page_dir = out.site_dir; // 这里为方便直接从 out 取值，不重新计算。
    }
    out.page_title = page.title || currentPageMetaConf?.title || config.title || '';
    out.page_author = config.author || '';
    if (isArray(page.author)) {
        out.page_author = [];
        for (const au of page.author)
            if (isString(au) && au)
                out.page_author.push(au);
        if (out.page_author.length === 0)
            out.page_author = '';
    } else if (isString(page.author) && page.author) {
        out.page_author = page.author;
    } else if (isArray(currentPageMetaConf?.author)) {
        out.page_author = [];
        for (const au of currentPageMetaConf.author)
            if (isString(au) && au)
                out.page_author.push(au);
        if (out.page_author.length === 0)
            out.page_author = '';
    } else if (isString(currentPageMetaConf?.author) && currentPageMetaConf.author) {
        out.page_author = currentPageMetaConf.author;
    }
    // 对于 path 和 permalink，允许 page_meta 覆盖 page 属性。
    out.path = page.path;
    if (currentPageMetaConf?.path)
        out.path = page.path.replace(currentPageMetaConf.pathPattern, currentPageMetaConf.path);
    if (!out.path)
        out.path = '';
    out.permalink = page.permalink;
    if (currentPageMetaConf?.permalink)
        // out.permalink = currentPageMetaConf.permalink; // 整体替换。
        out.permalink = page.path.replace(currentPageMetaConf.pathPattern, currentPageMetaConf.permalink); // 同样使用替换 path 部分，但对于 path 外的部分则无法处理。
    if (!out.permalink)
        out.permalink = '';
    out.date = page.date;
    if (!out.date)
        if (currentPageMetaConf?.date)
            out.date = moment(currentPageMetaConf.date);
        else
            out.date = moment();
    out.updated = page.updated;
    if (!out.updated)
        if (currentPageMetaConf?.updated)
            out.updated = moment(currentPageMetaConf.updated);
        else
            out.updated = moment();
    out.excerpt = page.excerpt || '';
    out.page_specific_description = page.description || currentPageMetaConf?.description || '';
    out.languages = page.languages;
    if (!out.languages) {
        out.languages = currentPageMetaConf?.languages; // 应用正则。
        for (const langKey in out.languages) {
            if (!Object.hasOwn(out.languages, langKey)) continue;
            let langPath = out.languages[langKey];
            langPath = page.path.replace(currentPageMetaConf.pathPattern, langPath);
            out.languages[langKey] = langPath;
        }
    }
    if (!out.languages)
        out.languages = {};
    out.page_categories = [];
    if (page.categories?.length) {
        page.categories.forEach((cate) => {
            out.page_categories.push({
                name: cate.name,
                id: cate._id,
                parent: cate.parent || '',
                slug: cate.slug,
                path: cate.path,
                permalink: cate.permalink
            });
        });
    }
    out.page_tags = [];
    if (page.tags?.length) {
        page.tags.forEach((tag) => {
            out.page_tags.push({
                name: tag.name,
                id: tag._id,
                slug: tag.slug,
                path: tag.path,
                permalink: tag.permalink
            });
        });
    }
    out.extra = page.extra || '';
    out.cover = page.cover || '';
    out.cover_title = page.cover_title || '';
    out.cover_alt = page.cover_alt ? page.cover_alt : out.cover_title;
    out.copyright = theme.copyright?.default || ''; // 主题配置中只是预置键值，具体还要看页面，所以认为是页面配置。
    if (page.copyright) {
        if (theme.copyright && page.copyright in theme.copyright)
            out.copyright = theme.copyright[page.copyright];
        else
            out.copyright = page.copyright;
    }
    out.indieweb_interactions = {};
    if (isPlainObject(page.indieweb_interactions)) {
        for (const key in page.indieweb_interactions) {
            if (Object.prototype.hasOwnProperty.call(page.indieweb_interactions, key)) {
                const interactions = page.indieweb_interactions[key];
                if (isArray(interactions)) {
                    let tmpInteractions = [];
                    for (const interUrl of interactions)
                        if (isUrl(interUrl))
                            tmpInteractions.push(interUrl);
                    out.indieweb_interactions[key] = tmpInteractions;
                }
            }
        }
    }
    out.syndications = [];
    if (isArray(page.syndications))
        for (const url of page.syndications)
            if (isUrl(url))
                out.syndications.push(url);
    out.interactions = {};
    if (isArray(page.interactions)) {
        if (page.interactions.includes('giscus')) {
            out.interactions.giscus = theme.interactions?.giscus ?? {};
            out.interactions.giscus.index = page.interactions.indexOf('giscus');
        }
        if (page.interactions.includes('twikoo')) {
            out.interactions.twikoo = theme.interactions?.twikoo ?? {};
            out.interactions.twikoo.index = page.interactions.indexOf('twikoo');
        }
        if (page.interactions.includes('webmentionjs')) {
            out.interactions.webmentionjs = theme.interactions?.webmentionjs ?? {};
            out.interactions.webmentionjs.index = page.interactions.indexOf('webmentionjs');
        }
    } else if (page.interactions === true) {
        if (theme.interactions?.enable?.includes('giscus')) {
            out.interactions.giscus = theme.interactions?.giscus ?? {};
            out.interactions.giscus.index = theme.interactions.enable.indexOf('giscus');
        }
        if (theme.interactions?.enable?.includes('twikoo')) {
            out.interactions.twikoo = theme.interactions?.twikoo ?? {};
            out.interactions.twikoo.index = theme.interactions.enable.indexOf('twikoo');
        }
        if (theme.interactions?.enable?.includes('webmentionjs')) {
            out.interactions.webmentionjs = theme.interactions?.webmentionjs ?? {};
            out.interactions.webmentionjs.index = theme.interactions.enable.indexOf('webmentionjs');
        }
    } else if (page.interactions === false) {
        out.interactions = false;
    } else if (isArray(theme.interactions?.enable)) {
        if (theme.interactions.enable.includes('giscus')) {
            out.interactions.giscus = theme.interactions?.giscus ?? {};
            out.interactions.giscus.index = theme.interactions.enable.indexOf('giscus');
        }
        if (theme.interactions.enable.includes('twikoo')) {
            out.interactions.twikoo = theme.interactions?.twikoo ?? {};
            out.interactions.twikoo.index = theme.interactions.enable.indexOf('twikoo');
        }
        if (theme.interactions.enable.includes('webmentionjs')) {
            out.interactions.webmentionjs = theme.interactions?.webmentionjs ?? {};
            out.interactions.webmentionjs.index = theme.interactions.enable.indexOf('webmentionjs');
        }
    } else {
        out.interactions = false;
    }
    if (out.interactions.giscus) {
        if (!isString(out.interactions.giscus.repo))
            out.interactions.giscus.repo = '';
        if (!isString(out.interactions.giscus.repo_id))
            out.interactions.giscus.repo_id = '';
        if (!isString(out.interactions.giscus.category))
            out.interactions.giscus.category = '';
        if (!isString(out.interactions.giscus.category_id))
            out.interactions.giscus.category_id = '';
        if (!isString(out.interactions.giscus.mapping))
            out.interactions.giscus.mapping = 'pathname';
        if (!isString(out.interactions.giscus.term))
            out.interactions.giscus.term = '';
        out.interactions.giscus.strict = !!out.interactions.giscus.strict;
        out.interactions.giscus.reactions_enabled = !!out.interactions.giscus.reactions_enabled;
        out.interactions.giscus.emit_metadata = !!out.interactions.giscus.emit_metadata;
        if (!isString(out.interactions.giscus.input_position))
            out.interactions.giscus.input_position = 'bottom';
    }
    if (out.interactions.twikoo) {
        if (!isString(out.interactions.twikoo.env_id))
            out.interactions.twikoo.env_id = '';
        if (!isString(out.interactions.twikoo.region))
            out.interactions.twikoo.region = '';
    }
    if (out.interactions.webmentionjs) {
        if (!isInteger(out.interactions.webmentionjs.wordcount) || out.interactions.webmentionjs.wordcount < 0)
            out.interactions.webmentionjs.wordcount = -1;
        if (!isInteger(out.interactions.webmentionjs.max_webmentions) || out.interactions.webmentionjs.max_webmentions < 0)
            out.interactions.webmentionjs.max_webmentions = 30;
        out.interactions.webmentionjs.prevent_spoofing = !!out.interactions.webmentionjs.prevent_spoofing;
        if (!isString(out.interactions.webmentionjs.sort_by))
            out.interactions.webmentionjs.sort_by = 'published';
        if (!isString(out.interactions.webmentionjs.sort_dir))
            out.interactions.webmentionjs.sort_dir = 'up';
        out.interactions.webmentionjs.comments_are_reactions = !!out.interactions.webmentionjs.comments_are_reactions;
    }
    out.prev = {};
    if (page.prev) {
        out.prev.title = page.prev.title;
        out.prev.path = page.prev.path;
    }
    out.next = {};
    if (page.next) {
        out.next.title = page.next.title;
        out.next.path = page.next.path;
    }
    // 插件适配
    out.search_db_path = config.search?.path;
    out.page_visibility = {
        hidden: false,
        no_index: false
    };
    if (config.hide_posts?.enable ?? false) {
        const hidePostsFilter = config.hide_posts?.filter;
        if (hidePostsFilter in page)
            out.page_visibility.hidden = true;
    }
    if (config.hide_posts?.no_index ?? false) {
        out.page_visibility.no_index = true;
    }
    out.page_encrypted = false;
    if ('encrypt' in config && 'password' in page)
        out.page_encrypted = true;
    ctxCache[page.path] = out;
    return out;
});
