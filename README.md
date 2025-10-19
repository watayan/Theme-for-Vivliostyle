# Theme-for-Vivliostyle
「Vivliostyleでつくるうすい本」で紹介している，自分用の執筆用フォーマット類です。

## 使ったソフトウェア
- Node.js
- vivliostyle-cli
- Visual Studio Code
- Python
- make
- pdftk

## ファイル構成
```
./ -+- vivliostyle.config.js
    +- css/
       +- main.css          基本的なCSS
       +- postscript.css    まえがき・あとがきのCSS
       +- toc.css           目次のCSS
       +- colophon.css      奥付のCSS
    +- images/
    +- preface.md           まえがき
    +- sectionXX.md         本文（XXは01からの連番）
    +- postface.md          あとがき
    +- colophon.md          奥付
    +- toc.py               toc.mdを生成するスクリプト
    +- Makefile
```
