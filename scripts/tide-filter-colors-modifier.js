'use strict';

const scriptName = 'tide-filter-colors-modifier';
hexo.extend.filter.register('after_render:css', (cssSrc, local) => {
    if (local.path.includes('tide.css')) {
        // log.debug(`${scriptName} after_post_render 正在给 ${local.path} 打补丁……`);
        cssSrc = cssSrc.replace('<TIDE_COLOR_PRIMARY_LIGHT>', '#008080');
    }
    return cssSrc;
}, 5); // 给一个 5 的优先级，比默认值 10 小。
