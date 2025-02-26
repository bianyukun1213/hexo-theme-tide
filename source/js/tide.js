'use strict';

let clientCtx = {};
const clientCtxElement = document.querySelector('meta[name="tide-client-ctx"]');
if (clientCtxElement)
    clientCtx = JSON.parse(decodeURIComponent(clientCtxElement.getAttribute('content')));

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

function systemColorSchemeChanged() {
    TideSettings.colorScheme = 'SYSTEM';
    document.documentElement.removeAttribute('data-tide-color-scheme');
}

const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)');
darkModePreference.addEventListener('change', e => e.matches && systemColorSchemeChanged());
const lightModePreference = window.matchMedia('(prefers-color-scheme: light)');
lightModePreference.addEventListener('change', e => e.matches && systemColorSchemeChanged());
if (TideSettings.colorScheme === 'LIGHT')
    document.documentElement.setAttribute('data-tide-color-scheme', 'light');
else if (TideSettings.colorScheme === 'DARK')
    document.documentElement.setAttribute('data-tide-color-scheme', 'dark');

function domContentLoadedHandler(eDomContentLoaded) {
    const tideRoot = document.getElementById('tide-root');
    const tideSideBarInputs = [...document.querySelectorAll('#tide-side-bar a')];
    const tideMainContent = document.getElementById('tide-main-content');
    const btnNav = document.getElementById('tide-btn-nav');
    const btnSearch = document.getElementById('tide-btn-search');
    const dialogSearch = document.getElementById('tide-dialog-search');
    const btnSwitchColorScheme = document.getElementById('tide-btn-switch-color-scheme');
    const btnSettings = document.getElementById('tide-btn-settings');
    const btnScrollToTop = document.getElementById('tide-btn-scroll-to-top');
    const btnOpenToc = document.getElementById('tide-btn-open-toc');
    const dialogToc = document.getElementById('tide-dialog-toc');
    const btnSwitchLang = document.getElementById('tide-btn-switch-lang');
    const dialogLangPicker = document.getElementById('tide-dialog-lang-picker');

    function toggleSideBar(status, buttonTriggered = false) {
        if (status) {
            tideRoot.setAttribute('data-tide-side-bar-expanded', 'true');
            for (const input of tideSideBarInputs)
                input.removeAttribute('tabindex');
        }
        else {
            tideRoot.setAttribute('data-tide-side-bar-expanded', 'false');
            for (const input of tideSideBarInputs)
                input.setAttribute('tabindex', '-1');
        }
    }

    function toggleSideBarOnResize() {
        if (window.matchMedia('(min-width: 1280px)').matches)
            toggleSideBar(true);
        else
            toggleSideBar(false);
    }
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
    btnSwitchColorScheme.addEventListener('click', function (e) {
        let currentScheme;
        if (document.documentElement.getAttribute('data-tide-color-scheme') === 'light')
            currentScheme = 'LIGHT';
        else if (document.documentElement.getAttribute('data-tide-color-scheme') === 'dark')
            currentScheme = 'DARK';
        if (!currentScheme) {
            if (darkModePreference.matches)
                currentScheme = 'DARK';
            else
                currentScheme = 'LIGHT';
        }
        if (currentScheme === 'LIGHT') {
            if (darkModePreference.matches) {
                TideSettings.colorScheme = 'SYSTEM';
                document.documentElement.removeAttribute('data-tide-color-scheme');
            } else {
                TideSettings.colorScheme = 'DARK';
                document.documentElement.setAttribute('data-tide-color-scheme', 'dark');
            }
        } else if (currentScheme === 'DARK') {
            if (lightModePreference.matches) {
                TideSettings.colorScheme = 'SYSTEM';
                document.documentElement.removeAttribute('data-tide-color-scheme');
            } else {
                TideSettings.colorScheme = 'LIGHT';
                document.documentElement.setAttribute('data-tide-color-scheme', 'light');
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
    window.addEventListener('resize', () => {
        toggleSideBarOnResize();
    });
    toggleSideBarOnResize();
    btnNav.addEventListener('click', function (e) {
        if (tideRoot.getAttribute('data-tide-side-bar-expanded') === 'true')
            toggleSideBar(false, true);
        else
            toggleSideBar(true, true);
    });
    btnScrollToTop.addEventListener('click', () => {
        tideMainContent.scrollTo({ top: 0, behavior: 'smooth' });
    });
    if (btnOpenToc) {
        btnOpenToc.addEventListener('click', () => {
            dialogToc.showModal();
        });
        if (document.getElementsByClassName('tide-toc').length === 0) {
            btnOpenToc.style.display = 'none';
        }
    }
    if (btnSwitchLang) {
        btnSwitchLang.addEventListener('click', () => {
            dialogLangPicker.showModal();
        });
    }
}

if (document.readyState !== 'loading')
    domContentLoadedHandler();
else
    document.addEventListener('DOMContentLoaded', domContentLoadedHandler);

window.addEventListener('hexo-blog-decrypt', function () {
    if (!window.location.hash.includes('tide-on-decryption-reload')) {
        window.location.hash = 'tide-on-decryption-reload';
        window.location.reload();
    }
    else {
        window.location.hash = window.location.hash.replace('tide-on-decryption-reload', '');
    }
});
