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
// todo：初始化 tide-left-bar-expanded 属性，并根据 resize 事件实时更新。

const toggleLeftBar = (status, buttonTriggered = false) => {
    if (status) {
        $('#tide-root').attr('tide-left-bar-expanded', 'true');
        // $('#tide-left-bar').removeAttr('aria-hidden');
        $('#tide-left-bar').attr('aria-expanded', 'true');
        $('#tide-left-bar a, #tide-left-bar :input').removeAttr('tabindex');
        if (buttonTriggered)
            $('#tide-left-bar nav a:first-of-type').focus(); // todo：只在按钮触发时聚焦？还是只要展开就聚焦？
    }
    else {
        $('#tide-root').attr('tide-left-bar-expanded', 'false');
        // $('#tide-left-bar').attr('aria-hidden', 'true'); // 阻止读屏器阅读。
        $('#tide-left-bar').attr('aria-expanded', 'false');
        $('#tide-left-bar a, #tide-left-bar :input').attr('tabindex', '-1'); // 阻止键盘 tab 导航。
        // $('#tide-btn-nav').focus();

    }
};
const toggleLeftBarOnResize = () => {
    if (document.documentElement.clientWidth >= 1280)
        toggleLeftBar(true);
    else
        toggleLeftBar(false);
};
toggleLeftBarOnResize();
// window.addEventListener('resize',
$(window).on('resize', () => {
    toggleLeftBarOnResize();
});
$('#tide-btn-nav').click(() => {
    if ($('#tide-root').attr('tide-left-bar-expanded') === 'true') {
        toggleLeftBar(false, true);
    }
    else {
        toggleLeftBar(true, true);
    }
});