$('#tide-btn-scroll-to-top').click(() => {
    $('#tide-main-content').animate({ scrollTop: 0 }, 300);
});
$('#tide-btn-search').click(() => {
    $('#ctx').toggle();
    // $('[un-text]').each(function (index) {

    //     const sizeList = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'];

    //     for (let i = 0; i < sizeList.length; ++i) {
    //         const sz = sizeList[i];
    //         const regex = new RegExp(`\\b${sz}\\b`);
    //         if (regex.test($(this).attr('un-text'))) {
    //             if (i < sizeList.length - 1) {
    //                 $(this).attr('un-text', sizeList[i + 1]);
    //             }
    //             break;
    //         }
    //     }
    // });
});
$('#tide-btn-settings').click(() => {
    if ($('html').attr('dir') === 'ltr')
        $('html').attr('dir', 'rtl');
    else
        $('html').attr('dir', 'ltr');
});

const toggleSideBar = (status, buttonTriggered = false) => {
    if (status) {
        $('#tide-root').attr('tide-side-bar-expanded', 'true');
        // $('#tide-side-bar').removeAttr('aria-hidden');
        // $('#tide-side-bar').attr('aria-expanded', 'true'); lighthouse 会报 aria-* 属性与角色不匹配
        $('#tide-side-bar a, #tide-side-bar :input').removeAttr('tabindex');
        // if (buttonTriggered)
            // $('#tide-side-bar nav a:first-of-type').focus(); // todo：只在按钮触发时聚焦？还是只要展开就聚焦？
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