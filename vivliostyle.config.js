// @ts-check
/** @type {import('@vivliostyle/cli').VivliostyleConfigSchema} */
const vivliostyleConfig = {
  title: '...',
  author: '...',
  size: 'A5',
  theme: ['css/common.css', 'css/contents.css'],
  image: 'ghcr.io/vivliostyle/cli:10.3.1',
  entry: [
    {
      path:  'preface.md',
      theme: 'css/common.css'
    },
    {
      path: 'toc.md',
      theme: ['css/common.css', 'css/toc.css']
    },
    'topic01.md',
    'topic02.md',
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
