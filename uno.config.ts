// uno.config.ts
import { defineConfig, presetUno, presetAttributify, presetTypography, presetIcons, transformerDirectives, transformerVariantGroup } from 'unocss';

export default defineConfig({
    content: {
        filesystem: ['./layout/*.tidejs', './layout/partials/*.tidejs']
    },
    preflights: [], // 在 _tide.src.css 中设置。
    presets: [
        presetUno(),
        presetAttributify({
            prefixedOnly: true
        }),
        presetTypography({
            cssExtend: {
                a: {
                    transition: 'transform ease-in-out 0.2s',
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
                'code:not([class])': {
                    color: 'var(--tide-color-code-inline)'
                },
                hr: {
                    border: '1px var(--tide-color-text-diminished) solid'
                },
                table: {
                    display: 'table',
                    'min-width': '100%',
                    margin: 0,
                    'table-layout': 'auto',
                    'white-space': 'nowrap',
                    'border-collapse': 'separate',
                    'border-spacing': 0,
                    border: '1px var(--tide-color-table-border) solid'
                },
                'td,th': {
                    'border-left': '1px var(--tide-color-table-border) solid'
                },
                'td:first-child,th:first-child': {
                    'border-left': 'none'
                },
                th: {
                    background: 'var(--tide-color-table-background-head)',
                    'border-bottom': '1px var(--tide-color-table-border) solid'
                },
                'tr:nth-child(2n)': {
                    background: 'var(--tide-color-table-background-even)'
                },
                figure: {
                    'text-align': 'center',
                },
                figcaption: {
                    'text-align': 'center',
                    'overflow-wrap': 'break-word'
                },
                // 代码块锁定 ltr。
                'pre:has(code)': {
                    direction: 'ltr',
                    'border-radius': 0
                },
                iframe: {
                    'max-width': '100%',
                    'margin-left': 'auto',
                    'margin-right': 'auto'
                }
            }
        }),
        // 无法动态引入，改为 Font Awesome，仅使用 logos。
        presetIcons({
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
        'sc-trans-default': 'transition-all ease-in-out duration-200',
        'sc-link-default': 'underline link:text-lk hover:(underline-offset-4) text-lk-hvr visited:text-lk-vst',
        // 'sc-link-plain': 'no-underline hover:(underline) text-t-prim',
        'sc-link-plain': 'decoration-transparent hover:(decoration-current) text-t-prim',
        'sc-btn-default': 'bg-transparent sc-trans-default flex items-center justify-center text-prim border-(2 prim solid) hover:scale-110 active:scale-90 cursor-pointer disabled:(opacity-50 cursor-not-allowed hover:transform-none active:transform-none)',
        'sc-dlg-fullscreen': 'bg-transparent absolute w-full max-w-full h-full max-h-full p-0 m-0 z-100 border-none',
        'sc-dlg-mask': 'bg-black/75 absolute w-full h-full'
    },
    transformers: [
        transformerDirectives(),
        transformerVariantGroup()
    ],
    theme: {
        colors: {
            'prim': 'var(--tide-color-primary)',
            'scnd': 'var(--tide-color-secondary)',
            'bPrim': 'var(--tide-color-background-primary)',
            'bScnd': 'var(--tide-color-background-secondary)',
            'tPrim': 'var(--tide-color-text-primary)',
            'tScnd': 'var(--tide-color-text-secondary)',
            'tDmsh': 'var(--tide-color-text-diminished)',
            'tSb': 'var(--tide-color-text-side-bar)',
            'fcsOl': 'var(--tide-color-focused-outline)',
            'lk': 'var(--tide-color-link)',
            'lkHvr': 'var(--tide-color-link-hover)',
            'lkVst': 'var(--tide-color-link-visited)',
            'code': 'var(--tide-color-code)',
            'tbBd': 'var(--tide-color-table-border)',
            'tbBgHd': 'var(--tide-color-table-border-head)',
            'tbBgEvn': 'var(--tide-color-table-border-even)',
        }
    },
    safelist: [
        '[un-text~="xs"]',
        '[un-text~="sm"]',
        '[un-text~="base"]',
        '[un-text~="lg"]',
        '[un-text~="xl"]',
        '[un-text~="2xl"]',
        '[un-text~="3xl"]',
        '[un-text~="4xl"]',
        '[un-text~="5xl"]',
        '[un-text~="6xl"]',
        '[un-text~="7xl"]',
        '[un-text~="8xl"]',
        '[un-text~="9xl"]',
        '[un-i="logos-hexo"]',
        '[un-mx="1"]'
    ] // JavaScript 切换字体大小、侧边栏按钮图标使用。
});
