// @ts-check
import { defineConfig } from '@vivliostyle/cli';

export default defineConfig({
  title: "My Title",
  author: "My Name",
  language: "ja",
  browser: "chrome@150.0.7871.115",
  image: "ghcr.io/vivliostyle/cli:11.2.0",
  size: 'A5',
  theme: 'css/common.css',
  entry: [
    'preface.md',
    'toc.md',
    'topic01.md',
    'topic02.md',
    'topic03.md',
    'topic04.md',
    'topic05.md',
    'topic06.md',
    'topic07.md',
    'topic08.md',
    'postface.md',
    'colophon.md'
  ],
  output: './contents.pdf',
  workspaceDir: '.vivliostyle',
});
