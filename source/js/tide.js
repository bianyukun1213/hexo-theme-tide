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

function domContentLoadedHandler(eDomContentLoaded) {
    const tideRoot = document.getElementById('tide-root');
    const tideSideBarInputs = [...document.querySelectorAll('#tide-side-bar a')];
    const tideMainContent = document.getElementById('tide-main-content');
    const btnNav = document.getElementById('tide-btn-nav');
    const btnSearch = document.getElementById('tide-btn-search');
    const dialogSearch = document.getElementById('tide-dialog-search');
    const btnSettings = document.getElementById('tide-btn-settings');
    const btnScrollToTop = document.getElementById('tide-btn-scroll-to-top');
    const btnOpenToc = document.getElementById('tide-btn-open-toc');
    const dialogToc = document.getElementById('tide-dialog-toc');
    const btnSwitchLang = document.getElementById('tide-btn-switch-lang');
    const dialogLangPicker = document.getElementById('tide-dialog-lang-picker');

    function toggleSideBar(status, buttonTriggered = false) {
        if (status) {
            tideRoot.setAttribute('tide-side-bar-expanded', 'true');
            for (const input of tideSideBarInputs)
                input.removeAttribute('tabindex');
        }
        else {
            tideRoot.setAttribute('tide-side-bar-expanded', 'false');
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
        if (tideRoot.getAttribute('tide-side-bar-expanded') === 'true')
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

window.addEventListener('hexo-blog-decrypt', () => {
    if (!window.location.hash.includes('tide-on-decryption-reload')) {
        window.location.hash = 'tide-on-decryption-reload';
        window.location.reload();
    }
    else {
        window.location.hash = window.location.hash.replace('tide-on-decryption-reload', '');
    }
});
