# Theme-for-Vivliostyle
「Vivliostyleでつくるうすい本」で紹介している，自分用の執筆用フォーマット類です。

## 使ったソフトウェア
- Node.js
- vivliostyle-cli
- Visual Studio Code
- pdftk

## ファイル構成
```
./ -+- vivliostyle.config.js
    +- toc.js                 目次生成スクリプト
    +- outline.js             outline.mdから見出しだけのtopic*.mdを生成する
    +- css/
       +- common.css          共通CSS
       +- contents.css        本文用CSS
       +- toc.css             目次用CSS
       +- colophon.css        奥付用CSS
       +- fonts/              TrueTypeフォントを置くフォルダ
    +- images/                画像ファイルを置くフォルダ
```

## `outline.js`について

章立てを箇条書きにした`outline.md`を読み込んで，`topic*.md`ファイルを生成する。最初の行の`level`はどのレベルの見出しによってファイルを分割するかを表す。たとえば`outline.md`が以下のとおりだったとする。
```
# 旧約聖書
## 律法書
### 創世記
### 出エジプト記
### レビ記
### 民数記
### 申命記
## 歴史書
### ヨシュア記
### 士師記
（略）
# 新約聖書
## 福音書
### マタイによる福音書
### マルコによる福音書
### ルカによる福音書
### ヨハネによる福音書
## 歴史書
### 使徒行伝
### パウロ書簡
（略）
## 預言書
### ヨハネの黙示録 - 終末と永遠の勝利
```
これを処理するに当たって，`level=1`だと旧約聖書が`topic01.md`，新約聖書が`topic02.md`になる。`level=2`だと立法書が`topic01.md`，歴史書が`topic02.md`になる。
