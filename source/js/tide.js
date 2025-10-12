'use strict';

const tideGlobal = {
    programmaticScroll: false,
    setProgrammaticScroll: function () {
        this.programmaticScroll = true;
        const that = this;
        setTimeout(() => {
            that.programmaticScroll = false;
        }, 5000);
    }
};
let clientCtx = {};
const clientCtxElement = document.querySelector('meta[name="tide-client-ctx"]');
if (clientCtxElement)
    clientCtx = JSON.parse(decodeURIComponent(clientCtxElement.getAttribute('content')));
// https://www.cnblogs.com/laneyfu/p/5923176.html
document.addEventListener('error', function (e) {
    if (e.target.tagName.toLowerCase() === 'img')
        e.target.className += ' tide-broken-img';
}, true);

function getPageLang() {
    return document.documentElement.getAttribute('lang');
}

function isPageRtl() {
    if (document.documentElement.getAttribute('dir') === 'rtl')
        return true;
    return false;
}

class TideSettings {
    static #settingsKey = 'tide_settings';
    static version = 1;
    static #colorScheme = 'SYSTEM';
    static get colorScheme() {
        return this.#colorScheme;
    }
    static set colorScheme(scheme) {
        if (scheme === 'SYSTEM' || scheme === 'LIGHT' || scheme === 'DARK') {
            this.#colorScheme = scheme;
            this.#saveSettings();
        }
    }
    static #readSettings() {
        let settings = localStorage.getItem(this.#settingsKey) ?? '{}';
        try {
            settings = JSON.parse(settings);
        } catch (error) {
            settings = {};
        }
        if (!clientUtils.isPlainObject(settings))
            settings = {};
        settings = this.#migrateSettings(settings);
        this.colorScheme = settings.colorScheme;
    }
    static #migrateSettings(oldSettings) {
        oldSettings = clientUtils.deepClone(oldSettings);
        if (!oldSettings.version || oldSettings.version < 1) {
            oldSettings.colorScheme = 'SYSTEM';
            oldSettings.version = 1;
        }
        return oldSettings;
    }
    static #saveSettings() {
        const settings = {
            version: this.version,
            colorScheme: this.colorScheme
        };
        localStorage.setItem(this.#settingsKey, JSON.stringify(settings));
    }
    static {
        this.#readSettings();
    }
}

document.documentElement.addEventListener('colorschemechange', function (e) {
    if (e.detail.alignedWithSystem) {
        TideSettings.colorScheme = 'SYSTEM';
        delete document.documentElement.dataset.colorScheme;
    } else if (e.detail.newValue === 'dark') {
        TideSettings.colorScheme = 'DARK';
        document.documentElement.dataset.colorScheme = 'dark';
    } else {
        TideSettings.colorScheme = 'LIGHT';
        document.documentElement.dataset.colorScheme = 'light';
    }
});

function systemColorSchemeChanged(matches) {
    document.documentElement.dispatchEvent(new CustomEvent('colorschemechange', {
        detail: {
            newValue: matches,
            alignedWithSystem: true
        }
    }));
}

const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)');
darkModePreference.addEventListener('change', e => e.matches && systemColorSchemeChanged('dark'));
const lightModePreference = window.matchMedia('(prefers-color-scheme: light)');
lightModePreference.addEventListener('change', e => e.matches && systemColorSchemeChanged('light'));
if (TideSettings.colorScheme === 'LIGHT') {
    document.documentElement.dispatchEvent(new CustomEvent('colorschemechange', {
        detail: {
            newValue: 'light',
            alignedWithSystem: false
        }
    }));
}
else if (TideSettings.colorScheme === 'DARK') {
    document.documentElement.dispatchEvent(new CustomEvent('colorschemechange', {
        detail: {
            newValue: 'dark',
            alignedWithSystem: false
        }
    }));
}

document.documentElement.addEventListener('forcedcolorschange', function (e) {
    // 强制颜色（高对比度）下取消手动设置的颜色方案。
    if (e.detail.active) {
        TideSettings.colorScheme = 'SYSTEM';
        delete document.documentElement.dataset.colorScheme;
        if (darkModePreference.matches) {
            document.documentElement.dispatchEvent(new CustomEvent('colorschemechange', {
                detail: {
                    newValue: 'dark',
                    alignedWithSystem: true
                }
            }));
        } else if (lightModePreference.matches) {
            document.documentElement.dispatchEvent(new CustomEvent('colorschemechange', {
                detail: {
                    newValue: 'light',
                    alignedWithSystem: true
                }
            }));
        }
    }
});

function handleForcedColorsChange(matches) {
    document.documentElement.dispatchEvent(new CustomEvent('forcedcolorschange', {
        detail: {
            active: matches
        }
    }));
}

const forcedColorsQuery = window.matchMedia('(forced-colors: active)');
forcedColorsQuery.addEventListener('change', e => handleForcedColorsChange(e.matches));

function domContentLoadedHandler(eDomContentLoaded) {
    const tideRoot = document.getElementById('tide-root');
    const tideSidebarInputs = [...document.querySelectorAll('#tide-sidebar a')];
    const tideMainContent = document.getElementById('tide-main-content');
    const btnUnmaskImageArray = [...document.getElementsByClassName('tide-btn-unmask-image')];
    const btnNav = document.getElementById('tide-btn-nav');
    const btnSearch = document.getElementById('tide-btn-search');
    const dialogSearch = document.getElementById('tide-dialog-search');
    const btnColorScheme = document.getElementById('tide-btn-color-scheme');
    const btnSettings = document.getElementById('tide-btn-settings');
    const tideFloatingWidgets = document.getElementById('tide-floating-widgets');
    const btnTop = document.getElementById('tide-btn-top');
    const btnToc = document.getElementById('tide-btn-toc');
    const dialogToc = document.getElementById('tide-dialog-toc');
    const btnLangs = document.getElementById('tide-btn-langs');
    const dialogLangPicker = document.getElementById('tide-dialog-lang-picker');
    const btnInteractions = document.getElementById('tide-btn-interactions');
    const btnExtraWidgets = document.getElementById('tide-btn-extra-widgets');

    function toggleSidebar(status) {
        if (status) {
            tideRoot.dataset.sidebarExpanded = '';
            btnNav.setAttribute('aria-expanded', 'true');
            for (const input of tideSidebarInputs)
                input.removeAttribute('tabindex');
        }
        else {
            delete tideRoot.dataset.sidebarExpanded;
            btnNav.setAttribute('aria-expanded', 'false');
            for (const input of tideSidebarInputs)
                input.setAttribute('tabindex', '-1');
        }
    }

    function toggleSidebarOnResize() {
        if (window.matchMedia('(orientation: landscape) and (min-width: 1280px)').matches)
            toggleSidebar(true);
        else
            toggleSidebar(false);
    }

    function adjustExtraWidgetsOnResize() {
        if (window.matchMedia('(min-height: 768px)').matches) {
            delete tideFloatingWidgets.dataset.extraWidgetsExpanded;
            delete tideFloatingWidgets.dataset.extraWidgetsCollapsed;
        }
    }

    for (const btn of btnUnmaskImageArray) {
        btn.addEventListener('click', function (e) {
            const mask = e.target.parentElement.parentElement;
            const img = mask.nextElementSibling;
            img.dataset.unmasked = '';
        });
        btn.addEventListener('keydown', function (e) {
            if (e.code === 'Space') {
                e.preventDefault();
                const mask = e.target.parentElement.parentElement;
                const img = mask.nextElementSibling;
                img.dataset.unmasked = '';
            }
        });
    }
    window.addEventListener('resize', clientUtils.debounce(() => {
        toggleSidebarOnResize();
        adjustExtraWidgetsOnResize();
    }));
    toggleSidebarOnResize();
    adjustExtraWidgetsOnResize();
    btnNav.addEventListener('click', function (e) {
        if (tideRoot.dataset.sidebarExpanded === '')
            toggleSidebar(false);
        else
            toggleSidebar(true);
    });
    if (btnSearch) {
        // btnSearch.addEventListener('click', function (e) {
        //     const el = document.getElementById('ctx');
        //     if (el.ownerDocument.defaultView.getComputedStyle(el, null).display === 'none')
        //         el.style.display = 'block';
        //     else
        //         el.style.display = 'none';
        // });
        btnSearch.addEventListener('click', () => {
            dialogSearch.showModal();
        });
    }
    btnColorScheme.addEventListener('click', function (e) {
        let currentScheme;
        if (document.documentElement.dataset.colorScheme === 'light')
            currentScheme = 'LIGHT';
        else if (document.documentElement.dataset.colorScheme === 'dark')
            currentScheme = 'DARK';
        if (!currentScheme) {
            if (darkModePreference.matches)
                currentScheme = 'DARK';
            else
                currentScheme = 'LIGHT';
        }
        if (currentScheme === 'LIGHT') {
            if (darkModePreference.matches) {
                document.documentElement.dispatchEvent(new CustomEvent('colorschemechange', {
                    detail: {
                        newValue: 'dark',
                        alignedWithSystem: true
                    }
                }));
            } else {
                document.documentElement.dispatchEvent(new CustomEvent('colorschemechange', {
                    detail: {
                        newValue: 'dark',
                        alignedWithSystem: false
                    }
                }));
            }
        } else if (currentScheme === 'DARK') {
            if (lightModePreference.matches) {
                document.documentElement.dispatchEvent(new CustomEvent('colorschemechange', {
                    detail: {
                        newValue: 'light',
                        alignedWithSystem: true
                    }
                }));
            } else {
                document.documentElement.dispatchEvent(new CustomEvent('colorschemechange', {
                    detail: {
                        newValue: 'light',
                        alignedWithSystem: false
                    }
                }));
            }
        }
    });
    btnSettings.addEventListener('click', function (e) {
        const html = document.getElementsByTagName('html')[0];
        if (isPageRtl())
            html.setAttribute('dir', 'ltr');
        else
            html.setAttribute('dir', 'rtl');
    });
    btnTop.addEventListener('click', () => {
        tideGlobal.setProgrammaticScroll();
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        [...document.getElementsByClassName('tide-toc-item-active')].forEach(e => e.classList.toggle('tide-toc-item-active'));
        tideMainContent.scrollTo({ top: 0 });
    });
    if (btnToc) {
        btnToc.addEventListener('click', () => {
            dialogToc.showModal();
        });
        if (document.getElementsByClassName('tide-toc').length === 0) {
            btnToc.style.display = 'none';
        } else {
            const tocLinks = [...document.getElementsByClassName('tide-toc-link')];
            const sections = tocLinks.map(link => {
                const rawId = link.getAttribute('href').slice(1);
                const id = decodeURIComponent(rawId);
                return document.getElementById(id);
            });
            const getCurrentSectionId = () => {
                let index = sections.findIndex((element) => {
                    return element && element.getBoundingClientRect().top - 100 > 0;
                });
                if (index === -1)
                    index = sections.length - 1;
                else if (index > 0)
                    index--;
                return sections[index].id;
            }
            tideMainContent.addEventListener('scroll', clientUtils.throttleDebounce(() => {
                if (tideGlobal.programmaticScroll)
                    return;
                const id = getCurrentSectionId();
                history.replaceState(null, '', '#' + id);
                tocLinks.forEach(link =>
                    link.parentElement.classList.toggle('tide-toc-item-active', link.getAttribute('href') === '#' + encodeURI(id))
                );
            }));
        }
    }
    if (btnLangs) {
        btnLangs.addEventListener('click', () => {
            dialogLangPicker.showModal();
        });
    }
    if (btnInteractions) {
        const target = document.getElementById('tide-page-interactions');
        btnInteractions.addEventListener('click', () => {
            tideGlobal.setProgrammaticScroll();
            window.location.hash = '';
            window.location.hash = 'tide-page-interactions';
            [...document.getElementsByClassName('tide-toc-item-active')].forEach(e => e.classList.toggle('tide-toc-item-active'));
        });
        if (!target)
            btnInteractions.style.display = 'none';
    }
    btnExtraWidgets.addEventListener('click', function () {
        if (typeof tideFloatingWidgets.dataset.extraWidgetsExpanded === 'undefined' && typeof tideFloatingWidgets.dataset.extraWidgetsCollapsed === 'undefined') {
            tideFloatingWidgets.dataset.extraWidgetsExpanded = '';
            return;
        }
        if (typeof tideFloatingWidgets.dataset.extraWidgetsExpanded === 'undefined') {
            tideFloatingWidgets.dataset.extraWidgetsExpanded = '';
            delete tideFloatingWidgets.dataset.extraWidgetsCollapsed;
        } else {
            tideFloatingWidgets.dataset.extraWidgetsCollapsed = '';
            delete tideFloatingWidgets.dataset.extraWidgetsExpanded;
        }
    });
    if ((!btnToc || btnToc.style.display === 'none')
        && (!btnLangs || btnLangs.style.display === 'none')
        && (!btnInteractions || btnInteractions.style.display === 'none')) {
        btnExtraWidgets.style.display = 'none';
    }
}

if (document.readyState !== 'loading')
    domContentLoadedHandler();
else
    document.addEventListener('DOMContentLoaded', domContentLoadedHandler);

window.addEventListener('hexo-blog-decrypt', function () {
    if (!window.location.hash === 'tide-on-decryption-reload') {
        window.location.hash = 'tide-on-decryption-reload';
        window.location.reload();
    }
    else {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
});
