// @ts-check
/** @type {import('@vivliostyle/cli').VivliostyleConfigSchema} */
const vivliostyleConfig = {
  title: '...',
  author: '...',
  size: 'A5',
  theme: ['css/common.css', 'css/contents.css'],
  image: 'ghcr.io/vivliostyle/cli:9.7.1',
  entry: [
    {
      path:  'preface.md',
      theme: 'css/common.css'
    },
    {
      path: 'toc.md',
      theme: ['css/common.css', 'css/toc.css']
    },
    'section01.md',
    'section02.md',
    'section03.md',
    'section04.md',
    'section05.md',
    {
      path: 'postface.md',
      theme: 'css/common.css'
    },
    {
      path: 'colophon.md',
      theme: ['css/common.css', 'css/colophon.css']
    }
  ],
  output: './contents.pdf',
  workspaceDir: '.vivliostyle',
};

module.exports = vivliostyleConfig;
