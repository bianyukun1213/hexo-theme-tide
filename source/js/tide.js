$('#tide-btn-scroll-top').click(() => {
    $('#tide-main-content').animate({ scrollTop: 0 }, 300);
});
$('#tide-btn-search').click(() => {
    if ($('html').hasClass('tide-large-font'))
        $('html').removeClass('tide-large-font');
    else
        $('html').addClass('tide-large-font');
});
$('#tide-btn-settings').click(() => {
    if ($('html').attr('dir') === 'ltr')
        $('html').attr('dir', 'rtl');
    else
        $('html').attr('dir', 'ltr');
});
// todo：初始化 tide-side-bar-expanded 属性，并根据 resize 事件实时更新。

const toggleSideBar = (status, buttonTriggered = false) => {
    if (status) {
        $('#tide-root').attr('tide-side-bar-expanded', 'true');
        // $('#tide-side-bar').removeAttr('aria-hidden');
        // $('#tide-side-bar').attr('aria-expanded', 'true'); lighthouse 会报 aria-* 属性与角色不匹配
        $('#tide-side-bar a, #tide-side-bar :input').removeAttr('tabindex');
        if (buttonTriggered)
            $('#tide-side-bar nav a:first-of-type').focus(); // todo：只在按钮触发时聚焦？还是只要展开就聚焦？
    }
    else {
        $('#tide-root').attr('tide-side-bar-expanded', 'false');
        // $('#tide-side-bar').attr('aria-hidden', 'true'); // 阻止读屏器阅读。
        // $('#tide-side-bar').attr('aria-expanded', 'false');
        $('#tide-side-bar a, #tide-side-bar :input').attr('tabindex', '-1'); // 阻止键盘 tab 导航。
        // $('#tide-btn-nav').focus();

    }
};
const toggleSideBarOnResize = () => {
    if (document.documentElement.clientWidth >= 1280)
        toggleSideBar(true);
    else
        toggleSideBar(false);
};
toggleSideBarOnResize();
// window.addEventListener('resize',
$(window).on('resize', () => {
    toggleSideBarOnResize();
});
$('#tide-btn-nav').click(() => {
    if ($('#tide-root').attr('tide-side-bar-expanded') === 'true') {
        toggleSideBar(false, true);
    }
    else {
        toggleSideBar(true, true);
    }
});