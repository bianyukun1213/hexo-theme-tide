// uno.config.ts
import { defineConfig, presetUno } from 'unocss';

export default defineConfig({
    content: {
        filesystem: ['./layout/*.ejs', './layout/partials/*.ejs']
    },
    presets: [presetUno()]
});
