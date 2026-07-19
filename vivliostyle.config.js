// @ts-check
import { defineConfig } from '@vivliostyle/cli';

export default defineConfig({
  title: "My Title",
  author: "My Name",
  language: "ja",
  browser: "chrome@150.0.7871.115",
  image: "ghcr.io/vivliostyle/cli:11.1.0",
  size: 'A5',
  theme: ['css/common.css', 'css/contents.css'],
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
});
