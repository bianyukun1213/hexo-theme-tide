'use strict';

let ejs = require('ejs');
ejs.delimiter = '?';
ejs.openDelimiter = '{';
ejs.closeDelimiter = '}';

const scriptName = 'tide-renderer-customized-ejs';
hexo.extend.renderer.register('ejs', 'html', (data, locals) => {
    return ejs.render(data.text, Object.assign({ filename: data.path }, locals));
}, true);
