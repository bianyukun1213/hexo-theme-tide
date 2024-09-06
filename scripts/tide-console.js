'use strict';

const nodeFs = require('node:fs/promises');

const hexoUtil = require('hexo-util');

const config = hexo.config;
const log = hexo.log;

hexo.extend.console.register('tide', 'hexo-theme-tide 命令行工具。', {

},
    async (args) => {
        // if (args._.length !== 0) {
        //     log.warn('参数无效。');
        //     return;
        // }
        // log.info('正在附加 _include 目录……');
        // try {
        //     const includes = await nodeFs.readdir('_include');
        //     for (const file of includes) {
        //         await nodeFs.cp(`_include/${file}`, `source.en/${file}`, { recursive: true });
        //         await nodeFs.cp(`_include/${file}`, `source.zh-CN/${file}`, { recursive: true });
        //     }
        //     log.info('附加完成。');
        // } catch (error) {
        //     log.error('附加失败：', error);
        //     throw error;
        // }


        console.log(hexo.theme.config)

    });
