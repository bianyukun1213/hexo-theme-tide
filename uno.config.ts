// uno.config.ts
import { defineConfig, presetWind4, presetTypography, presetIcons, transformerDirectives, transformerVariantGroup } from 'unocss';

export default defineConfig({
    content: {
        filesystem: ['./layout/*.ejs', './layout/**/*.ejs']
    },
    presets: [
        presetWind4({
            prefix: 'un-',
            preflights: {
                reset: false // 使用 modern-normalize.min.css。
            }
        }),
        presetTypography({
            selectorName: 'un-prose',
            cssExtend: {
                a: {
                    'font-weight': 'unset',
                    'text-decoration': 'underline'
                },
                'a:link': {
                    color: 'var(--tide-color-link)'
                    // 用不了 transformerDirectives，如 '@apply': 'text-lk'。
                },
                'a:hover': {
                    'text-underline-offset': '4px',
                    color: 'var(--tide-color-link-hover)'
                },
                'a:visited': {
                    color: 'var(--tide-color-link-visited)'
                },
                hr: {
                    margin: '1em 0',
                    'border-color': 'unset',
                    border: '1px var(--tide-color-text-diminished) solid'
                },
                // 'ul li': {
                //     'list-style': 'disc'
                // },
                // 'ul li ul li': {
                //     'list-style': 'circle'
                // },
                s: {
                    'text-decoration': 'underline',
                    'text-underline-offset': '-40%',
                    'text-decoration-skip-ink': 'none'
                },
                'code:not([class])': {
                    'overflow-wrap': 'break-word',
                    'white-space': 'normal',
                    padding: '0.25em',
                    'background': 'var(--tide-color-background-secondary)',
                    color: 'var(--tide-color-code-inline)',
                    'border-radius': '0.25em'
                },
                // 似乎是 UnoCSS 的 bug，此处 ::before 和 ::after 需要分别写。
                'code:not([class])::before': {
                    content: 'none'
                },
                'code:not([class])::after': {
                    content: 'none'
                },
                // 代码块锁定 ltr。
                'pre:has(code)': {
                    direction: 'ltr',
                    'border-radius': 0,
                    'font-weight': 'unset',
                    'padding-inline-start': 0,
                    'padding-inline-end': 0
                },
                blockquote: {
                    padding: '0.5em 1em',
                    margin: '1em 0',
                    'font-weight': 'unset',
                    'font-style': 'italic',
                    background: 'var(--tide-color-background-secondary)',
                    'border-left': 'none', // 取消 prose 样式。
                    'border-inline-start': '4px var(--tide-color-primary) solid',
                    outline: '1px transparent solid'
                },
                'blockquote p:first-of-type::before': {
                    content: 'none'
                },
                'blockquote p:last-of-type::after': {
                    content: 'none'
                },
                'blockquote *:first-child': {
                    'margin-top': '0'
                },
                'blockquote *:last-child': {
                    'margin-bottom': '0'
                },
                table: {
                    display: 'table',
                    width: 'unset',
                    'min-width': '100%',
                    margin: 0,
                    'font-size': 'unset',
                    'line-height': 'unset',
                    'table-layout': 'auto',
                    'white-space': 'nowrap',
                    'border-collapse': 'separate',
                    'border-spacing': 0,
                    border: '1px var(--tide-color-table-border) solid'
                },
                'td,th': {
                    'padding-inline-start': 0,
                    'padding-inline-end': 0,
                    padding: '.625em 1em',
                    'border-inline-start': '1px var(--tide-color-table-border) solid'
                },
                'td:first-child,th:first-child': {
                    'border-inline-start': 'none'
                },
                th: {
                    'text-align': 'center',
                    'vertical-align': 'unset',
                    background: 'var(--tide-color-table-background-head)',
                    'border-bottom': '1px var(--tide-color-table-border) solid',
                    'font-weight': '700' // 对应 --fontWeight-bold
                },
                'tr:nth-child(2n)': {
                    background: 'var(--tide-color-table-background-even)'
                },
                figure: {
                    'margin': '1em auto',
                    'text-align': 'center'
                },
                figcaption: {
                    'margin-top': '0.25em',
                    'text-align': 'center',
                    'overflow-wrap': 'break-word'
                },
                // 只将 figure 内的图片设为 block。行内图片保持行内。
                'figure img': {
                    display: 'block',
                    margin: '0 auto'
                },
                iframe: {
                    display: 'block',
                    'max-width': '100%',
                    'margin': '1em auto'
                },
                video: {
                    display: 'block',
                    'max-width': '100%',
                    'margin': '1em auto'
                }
            }
        }),
        // 无法动态引入，改为 Font Awesome，仅使用 logos。
        presetIcons({
            prefix: 'un-i-',
            collections: {
                logos: () => import('@iconify-json/logos').then((i) => i.icons as any)
            },
            extraProperties: {
                display: 'inline-block',
                'vertical-align': 'middle'
            }
        })
    ],
    shortcuts: {
        // 与上方 prose 部分对应。
        'un-sc-clearfix': 'after:un-clear-both after:un-content-empty after:un-block',
        'un-sc-trans-default': 'motion-safe:(un-transition-transform un-ease-in-out un-duration-200)',
        'un-sc-link-default': 'un-underline link:un-text-lk hover:(un-underline-offset-4 un-text-lk-hvr) visited:un-text-lk-vst',
        'un-sc-link-plain': 'un-decoration-transparent hover:(un-decoration-current) un-text-txt-prim',
        'un-sc-btn-default': 'un-bg-bg-prim un-sc-trans-default un-flex un-items-center un-justify-center un-text-prim un-border-(2 prim solid) hover:un-scale-110 active:un-scale-90 un-cursor-pointer disabled:(un-opacity-50 un-cursor-not-allowed hover:un-transform-none active:un-transform-none)',
        'un-sc-btn-plain': 'un-bg-bg-prim un-sc-trans-default un-flex un-items-center un-justify-center un-text-txt-prim un-border-(2 txt-prim solid) hover:un-scale-110 active:un-scale-90 un-cursor-pointer disabled:(un-opacity-50 un-cursor-not-allowed hover:un-transform-none active:un-transform-none)',
        'un-sc-dlg-fullscreen': 'un-bg-transparent un-absolute un-size-full un-max-w-full un-max-h-full un-p-0 un-m-0 un-z-100 un-border-none',
        'un-sc-dlg-mask': 'un-bg-black/75 un-absolute un-size-full',
        'un-sc-select-default': 'un-bg-bg-prim un-text-txt-prim un-border-(2 prim solid) disabled:(un-opacity-50 un-cursor-not-allowed)',
        'un-sc-select-plain': 'un-bg-bg-prim un-text-txt-prim un-border-(2 txt-prim solid) disabled:(un-opacity-50 un-cursor-not-allowed)',
        'un-sc-input-default': 'un-bg-bg-prim un-text-txt-prim un-border-(2 prim solid) un-px-4 disabled:(un-opacity-50 un-cursor-not-allowed)',
        'un-sc-input-plain': 'un-bg-bg-prim un-text-txt-prim un-border-(2 txt-prim solid) un-px-4 disabled:(un-opacity-50 un-cursor-not-allowed)'
    },
    transformers: [
        transformerDirectives(),
        // transformerVariantGroup() // 有前缀的情况下似乎无法生效。
    ],
    theme: {
        colors: {
            'prim': 'var(--tide-color-primary)',
            'scnd': 'var(--tide-color-secondary)',
            'bg-prim': 'var(--tide-color-background-primary)',
            'bg-scnd': 'var(--tide-color-background-secondary)',
            'bg-sb': 'var(--tide-color-background-sidebar)',
            'txt-prim': 'var(--tide-color-text-primary)',
            'txt-scnd': 'var(--tide-color-text-secondary)',
            'txt-dmsh': 'var(--tide-color-text-diminished)',
            'txt-sb': 'var(--tide-color-text-sidebar)',
            'fcs-ol': 'var(--tide-color-focused-outline)',
            'lk': 'var(--tide-color-link)',
            'lk-hvr': 'var(--tide-color-link-hover)',
            'lk-vst': 'var(--tide-color-link-visited)',
            'code': 'var(--tide-color-code)',
            'tb-bd': 'var(--tide-color-table-border)',
            'tb-bg-hd': 'var(--tide-color-table-background-head)',
            'tb-bg-evn': 'var(--tide-color-table-background-even)',
        }
    },
    safelist: [
        'un-i-logos-hexo', 'un-h-6', 'un-mx-1', 'un-align-bottom' // 此四项在页脚显示图标时需要。
    ]
});
