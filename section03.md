# フォルダ内の構成

## 前提

本書では，個人的な趣味や思想から次のような前提を設けた。

- 章別にファイルを分ける（全5章）。
- 章のレベルは section, subsection, subsubsection まで。
- まえがき・目次・本文・あとがき・奥付の順。
- まえがき・本文・あとがきはMarkdownで書く。
- 奥付はファイルの拡張子は`.md`ではあるものの，実際はHTML。
- 目次は自動生成。
- 表1〜表4<span class="notetext">順に表紙，表紙裏，裏表紙裏，裏表紙。</span>は別途PDFとして1ページずつ作成。

## ファイル・フォルダの用意

ファイル構成は次の通り。それぞれのファイルについては付記した章番号のところで解説する。
`〜.md` はとりあえず空のテキストファイルとして用意しておけばいい。
フォルダ`css`にはCSSのファイルを，`images`には画像ファイルを置く。

```
vivliostyle.config.js       # (3.3)
toc.py                      # (3.4)
Makefile                    # (3.5)
preface.md                  # まえがき
postface.md                 # あとがき
section01.md〜section05.md  # 本文　第1章〜第5章
colophon.md                 # 奥付
cover1.pdf〜cover4.pdf      # 表1〜表4
css/                        # CSSを置くフォルダ
+- common.css               # (4.1)
+- contents.css             # (4.2)
+- toc.css                  # (4.3)
+- colophon.css             # (4.4)
images/                     # 画像ファイルを置くフォルダ
+- （画像ファイル）
```

## `vivliostyle.config.js`

`npx vivliostyle init` を実行すると`vivliostyle.config.js` が作られる。
これは設定ファイルの雛形なので必要なところを書き換える。
以下は本書の例である。
`theme`は複数ファイルを指定できるが，`path`は1ファイルであることに注意。

```JS title=vivliostyle.config.js
// @ts-check
/** @type {import('@vivliostyle/cli').VivliostyleConfigSchema} */
const vivliostyleConfig = {
  title: 'Vivliostyleでうすい本',
  author: 'わたやん',
  size: 'A5',
  theme: ['css/common.css', 'css/contents.css'],
  image: 'ghcr.io/vivliostyle/cli:8.19.0',
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
  workspaceDir: '.vivliostyle'
};

module.exports = vivliostyleConfig;
```

`title`，`author`，`size`，`output` については説明の必要はないだろう。
`theme` では2つのCSSファイル `css/common.css`，`css/contents.css` を指定しているが，
これは`entry`で個別指定していない`section01.md`〜`section05.md` に適用される。

`entry` には読み込む `md` ファイルを順番に書いてあり，適用するCSSファイルを指定している。
具体的には，次のようになっている。

<table class="mytable">
  <tr><th class="col6">ファイル</th><th class="col20">適用されるCSS</th></tr>
  <tr><td><code>preface.md</code></td><td><code>css/common.css</code></tr>
  <tr><td><code>toc.md</code></td><td><code>css/common.css, css/toc.css</code></tr>
  <tr><td><code>section*.md</code></td><td><code>css/common.css, css/contents.css</code></tr>
  <tr><td><code>postface.md</code></td><td><code>css/common.css</code></tr>
  <tr><td><code>colophon.md</code></td><td><code>css/common.css, css/colophon.css</code></tr>
</table>

`workspaceDir` は是非設定しておきたい。Vivliostyle が生成する中間ファイルがすべてそこにまとめられるので，フォルダがスッキリする。
ここでは`.vivliostyle`というように`"."`で始まるフォルダ名にしているが，これはUNIX系のOSでは隠しフォルダ扱いされて邪魔にならないからである。
Windows系ではエクスプローラなどで普通に表示されるので，このような名前にする理由はない。
むしろ扱いにくいので普通のフォルダ名にしておくのがいいような気がする。
なお，このフォルダ内に生成されるHTMLファイルはCSSを書く上で参考にすることがよくある。

## `toc.py`

本文`section*.md`から見出しを拾って目次ファイル `toc.md` を生成するスクリプトである。
Vivliostyle自体に目次を作る機能はあるのでそれを使ってもいいのだが，
筆者にとってはこの方が好みなのでそうしているだけのことである。
とはいえ，このように自前で処理する部分を増やすことはVivliostyle全体というシステムの中に例外的な異物を増やすことになりかねないので，やりすぎないよう気をつけたいところではある。

中身は見ての通り，`#` 〜 `###` で始まる行を探して処理しているだけである。
ただし<code>```</code>や<code>~~~</code>で書かれたコードブロックの中は拾わないようにしている。

途中にある「見出しの文字列を加工してidに」というのは，
目次から該当する場所へのリンクを貼る際に使われる `id` の処理の話である。
基本的にはタイトルがそのまま使われるのだが，
一部の文字がカットされたり，空白が`-`に変換されたりしているので，それに対応している。
出たとこ勝負で直しているので漏れがあるかもしれない。
もちろんVivliostyleのコードを読めば，どのような変換がなされているかわかるのだが，そこまですることもないかと考えている。
もし漏れがあれば目次のページ数が `??` になって正しく表示されないからすぐ分かるから，
その都度追加すればいい。

```Python title=toc.py
import glob
import re

classname = ['toc-section', 'toc-subsection', 'toc-subsubsection']

ftoc = open("toc.md", "w")
ftoc.write('<nav id="toc" role="doc-toc">\n\n')
ftoc.write('# 目次\n\n')

filenames = sorted(glob.glob("section*.md"))
for filename in filenames:
    with open(filename) as f:
        pre_flag = False
        html = filename[:-2] + 'html'   # リンク用のファイル名（.html）
        for l in f:
            if re.match(r"^[~`]{3}", l): # ```や~~~で始まるブロック内か
                pre_flag = not pre_flag
            info = re.match(r"^(#{1,3})\s+(.*)", l) # 1〜3レベルの見出し
            if(info and not pre_flag):
                level = len(info[1]) - 1        # 見出しレベル（0〜2）
                title = info[2]                 # 見出しの文字列
                # 見出しの文字列を加工してidに
                id = re.sub(r'[<>，[「」・（）"`\'\.]','',title.lower())  
                id = re.sub(r'[ ]','-',id)
                ftoc.write(' ' * level * 4 + '- ' + '[{}]({}#{})'
                    .format(title, html, id))
                ftoc.write('{.' + classname[level] + '}\n')
ftoc.write('\n\n</nav>\n')
ftoc.close()

print('toc.md was built.')
```

---

## `Makefile`

本文が変更されたら `toc.py` を実行して `toc.md` を更新する，
という処理を行うためにmakeを使っている。
内容については解説はいらないだろう。
ここでは表1〜表4のファイル `cover1.pdf`〜`cover4.pdf` の結合も行っている。

```make title=Makefile
contents = section01.md section02.md section03.md \\
           section04.md section05.md
markdown = preface.md postface.md colophon.md toc.md
css      = css/common.css css/contents.css css/toc.css \\
           css/colophon.css

.PHONY: all preview clean

all: Thinbook_with_Vivliostyle.pdf

preview: $(contents) $(markdown) $(css) toc.md
	@echo "Preparing preview..."
	npx vivliostyle preview

contents.pdf: $(contents) $(markdown) $(css) toc.md
	@echo "Generating contents.pdf..."
	npx vivliostyle build

Thinbook_with_Vivliostyle.pdf: contents.pdf
    @echo "Generating the complete pdf includeing covers..."
    pdftk cover1.pdf cover2.pdf contents.pdf cover3.pdf cover4.pdf \\
        output ThinBook_with_Vivliostyle.pdf

toc.md: $(contents)
	@echo "Generating table of contents..."
	python3 toc.py

clean: 
	@echo "Cleaning up..."
	rm -f Thinbook_with_Vivliostype.pdf contents.pdf toc.md
```

`cover*.pdf` は依存関係に含めていない。
表紙の修正は何度も行う作業であるが，そのたびにそれを含めたビルドをする必要はないと考えているからである。

余談であるが，筆者はコンパイラや `make` ， `patch` などのないパソコンを使う機会がほとんどない。
そのためこれらのツールは必ずインストールされているものと思ってしまっているきらいがある。
高校の教科「情報」のプログラミング演習で使えるようにと開発しているPyPENはGitHubで公開しているのだが，`patch` がないとビルドできないようになっていた時期があった。
その時期のをGitHubから使ってた人もいたのに，
それに関するコメントがなかったということは，
そういう人は自分で解決してしまったり，もともと `patch` がインストールしてあったりするのだろう。