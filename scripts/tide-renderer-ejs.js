// 'use strict';

// const ejs = require('ejs');

// function ejsRenderer(data, locals) {
//   return ejs.render(data.text, Object.assign({filename: data.path}, locals));
// }

// ejsRenderer.compile = function(data) {
//   return ejs.compile(data.text, {
//     filename: data.path
//   });
// };

// module.exports = ejsRenderer;

// /* global hexo */

// 'use strict';

// const renderer = require('./lib/renderer');

// hexo.extend.renderer.register('ejs', 'html', renderer, true);

'use strict';

let ejs = require('ejs');
ejs.delimiter = '?';
ejs.openDelimiter = '{';
ejs.closeDelimiter = '}';

const scriptName = 'tide-renderer-ejs';
hexo.extend.renderer.register('ejs', 'html', (data, locals) => {
    return ejs.render(data.text, Object.assign({ filename: data.path }, locals));
}, true);
