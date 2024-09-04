// uno.config.ts
import { defineConfig, presetUno, presetTypography, transformerDirectives, transformerVariantGroup, presetAttributify } from 'unocss';

export default defineConfig({
    content: {
        filesystem: ['./layout/*.ejs', './layout/partials/*.ejs']
    },
    preflights: [], // 这里写的 preflight 会在 UnoCSS 默认的 preflight 之后，@import 不在最前面。决定在 _tide.src.css 里添加 preflight。
    presets: [
        presetUno(),
        presetTypography({
            cssExtend: {
                'a:link': {
                    color: 'var(--tide-color-link)'
                    // '@apply': 'text-lk' 用不了 transformerDirectives。
                },
                'a:hover': {
                    display: 'inline-block',
                    transform: 'translateY(-2px)'
                },
                'a:visited': {
                    color: 'var(--tide-color-link-visited)'
                },
                'code:not([class])': {
                    color: 'var(--tide-color-code)'
                },
                hr: {
                    border: '1px var(--tide-color-text-diminished) solid'
                },
                table: {
                    'table-layout': 'auto',
                    'border-collapse': 'separate',
                    'border-spacing': 0,
                    border: '2px var(--tide-color-table-border) solid'
                },
                'td, th': {
                    'border-left': '1px var(--tide-color-table-border) solid'
                },
                'td:first-child, th:first-child': {
                    'border-left': 'none'
                },
                td: {
                    width: '100%'
                },
                th: {
                    background: 'var(--tide-color-table-background-head)',
                    'border-bottom': '1px var(--tide-color-table-border) solid'
                },
                'tr:nth-child(2n)': {
                    background: 'var(--tide-color-table-background-even)'
                },
                figure: {
                    'text-align': 'center'
                }
            }
        }),
        presetAttributify({
            prefixedOnly: true
        })
    ],
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
            'lk': 'var(--tide-color-link)',
            'lkHvr': 'var(--tide-color-link-hover)',
            'lkVst': 'var(--tide-color-link-visited)',
            'code': 'var(--tide-color-code)',
            'tbBd': 'var(--tide-color-table-border)',
            'tbBgHd': 'var(--tide-color-table-border-head)',
            'tbBgEvn': 'var(--tide-color-table-border-even)',
        }
    },
    safelist: ['[un-ltr="left-72"]', '[un-rtl="right-72"]']
});
