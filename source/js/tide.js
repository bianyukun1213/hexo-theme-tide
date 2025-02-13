'use strict';

console.log('tide.js loaded')

function isPageRtl() {
    if (document.documentElement.getAttribute('dir') === 'rtl')
        return true;
    return false;
}

function domContentLoadedHandler(e) {
    const tideRoot = document.getElementById('tide-root');
    const tideSideBarInputs = [...document.querySelectorAll('#tide-side-bar a')];
    const tideMainContent = document.getElementById('tide-main-content');
    const btnNav = document.getElementById('tide-btn-nav');
    const btnScrollToTop = document.getElementById('tide-btn-scroll-to-top');
    const btnSearch = document.getElementById('tide-btn-search');
    const btnSettings = document.getElementById('tide-btn-settings');

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

    btnScrollToTop.addEventListener('click', () => {
        // $('#tide-main-content').animate({ scrollTop: 0 }, 300);
        // tideMainContent.style.transition = 'all 300';
        tideMainContent.scrollTo({ top: 0, behavior: 'smooth' });
    });
    btnSearch.addEventListener('click', function (e) {
        const el = document.getElementById('ctx');
        if (el.ownerDocument.defaultView.getComputedStyle(el, null).display === 'none')
            el.style.display = 'block';
        else
            el.style.display = 'none';

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
        if (tideRoot.getAttribute('tide-side-bar-expanded') === 'true')
            toggleSideBar(false, true);
        else
            toggleSideBar(true, true);
    });
}

if (document.readyState !== 'loading')
    domContentLoadedHandler();
else
    document.addEventListener('DOMContentLoaded', domContentLoadedHandler);
