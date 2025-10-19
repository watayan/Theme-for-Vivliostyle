# CSS

## `common.css`

共通で設定するスタイルに関する記述である。ちょっと長いのでいくつかに分割して解説することにする。

### フォントの準備

Google Fonts （[`https://fonts.google.com`](https://fonts.google.com)）を使っておけば間違いないかなという気がしている。
本書で必要なのはセリフ・サンセリフ・モノスペースの3つなので，それらを選択してから
「Get embed code」を押す（図1）。
するとこのフォントを使うにあたってどのようなコードを書けばいいかが表示されるので，
Webの@importを選び（図2），`@import` の行をCSSの冒頭にコピーすればいい。

![フォントを選択](images/google_fonts1.png){width=90%}

![CSSに埋め込むコード](images/google_fonts2.png){width=90%}

フォント名は `@import` 行に書かれているものの `+` を半角空白で置き換えたものである
（例：`M+PLUS+1+Code`→`M PLUS 1 Code`）。
あとはこれを `font-family` で指定していけばいい。
ただしこの方法はオンラインが前提なので，
オフラインの状態に気づかなくて代替フォントで組版がなされてしまうことがあるのがときどき悲しい
（見た目ですぐわかるし，フォントデータをダウンロードしてしまえば困ることはないのだが）。
もちろんGoogle Fontsだけでなく手持ちのフォントも使えるので，
手軽にいろいろなフォントを試すことができる。
中等教育関係ではモリサワのUDデジタル教科書体が広く使われているようだ。

とはいってもいちいちこの名前を書くのは面倒なので，
CSSのカスタムプロパティを利用したい。
具体的にはコード1の `:root` の冒頭3行で定義したものの一つを，
その次の行のように `var(...)` として呼び出す，というような使い方になる。
このようにしておけば，
定義部分を書き換えるだけで文書全体が切り替わる。

```CSS title=common.css（その1）
@charset "utf-8";

@import url('https://fonts.googleapis.com/css2?family=BIZ+UDPGothic:wght@400;700&family=BIZ+UDPMincho&family=M+PLUS+1+Code:wght@100..700&display=swap');

:root {
    --serif-font: "BIZ UDPMincho", serif;
    --sans-serif-font: "BIZ UDPGothic", sans-serif;
    --monospace-font: "M PLUS 1 Code", monospace;
    font-family: var(--serif-font);
    font-size: 13Q;
    line-height: 22Q;
    letter-spacing: normal;
    hanging-punctuation: allow-end;
    widows: 1;
    orphans: 1;
}
```

---

### 余白

![天・地・小口・ノド](images/tenchi.png){width=40%}
続いてページの余白や，ページ番号表示に関する設定を行う。
ここでは紙出力を考えて小口とノドの寸法を変えているが，
PDFだけなら同じ寸法にした方がスクロールのときに「揺れ」が生じなくていい，という考え方もある。

```CSS title=common.css（その2）
@page {
    margin-block: 10mm 18mm;            /* 天・地 */
    @bottom-center {                    /* ページ番号 */ 
        font-size: 10Q;
        content: "- " counter(page) " -";
    }
}

@page :left {
    margin-inline: 16mm 18.25mm;    /* 小口・ノド */
}

@page :right {
    margin-inline: 18.25mm 16mm;    /* ノド・小口 */
}
```

### カウンタ・見出し


カウンタと見出しに関係する部分である。
カウンタにはファイル内でのものもあれば，
全体を通してのものもある。`subsection`，`subsubsection` や図番号などはファイルごとに
リセットしていいが，`section` はページ番号のように全体を通したカウンタにしなくてはいけない。
その場合には`section`を`@page`の中でリセット・加算する必要がある。
そのため，ここでは `section` を最初の `@page` でリセットしている。
加算するのは本文用のCSS `contents.css` の中で行う。

このようなややこしいことをしているのは，現状ではVivliostyleがルート要素からページコンテキストへのプロパティ値の継承をサポートしていないからである。
Vivliostyleのドキュメントページでは`@page:first`でリセット（定義）し，
`@page:nth(1)`で加算すればいいとしているが，
`nth(1)`がVivliostyle独自のものであるため，Visual Studio Codeがこれをエラー扱いする。
それがなんだか気持ち悪いのでこのように実装した。
いつかこういった面倒がなくなって，
このような小細工が「過去のバッドノウハウ」になるのだろう。

```CSS title=common.css（その3）
@page :first {
    counter-reset: section page 2;  /* 表1・表2のページ番号をスキップ */
}

h1, h2, h3 {
    font-family: var(--sans-serif-font);
    font-weight: 400;
}

h1 {                                /* section */
    font-size: 24Q;
    display:inline-block;
    width: 100%;
    border-bottom: #000 solid 1pt;  /* 下線をひく */
    break-before: left;
    counter-reset: subsection figure-counter code-counter;
}

h2 {                                /* subsection */
    font-size: 16Q;
    border-bottom: #000 dotted 0.5pt;   /* 下点線をひく */
    counter-increment: subsection;
    counter-reset: subsubsection;
}

h3 {                                /* subsubsection */
    font-size: 16Q;
    margin-block-end: 0.5em;
    counter-increment: subsubsection;
}

h1 + section h2, h2 + section h3{
    break-before: avoid;    /* 改ページを避ける */
}

```

### 各要素の書式

```CSS title=common.css（その4）
p {
    font-size: 13Q;
    line-height: 22Q;
    text-align: justify;
    text-indent: 1em;
    margin-block: 0;
}

a{      /* リンクは下線とか色とかつけない */
    text-decoration: none;
    color: #000;
}

em{     /* 強調はゴシックで */    
    font-style: normal;     /* 斜体字にしない */
    font-family:  var(--sans-serif-font);
    font-weight: 700;       /* かなり重い */
}

code, pre {
    font-family:  var(--monospace-font);
}
```

`common.css` に書くのはここまでとする。

---

## `contents.css`

本文用のCSSである。

### 見出し関係

4.1.3で述べた`section`の処理をここで行っている。
本文用のファイルは章ごとに分かれているので，
先頭行に `#` で始まる章見出しを置くことになる。
そのことによって `page: contents`が有効になり，
`@page` 内で定義されたカウンタ `section` が加算できる
（まえがき・あとがきは`contents.css`を読み込まないのでそれをしない）。
また，章タイトルの前に置く章番号のフォーマットも決定している。

```CSS title=contents.css（その1）
@charset "UTF-8";

@page contents {                    /* 章番号を加算 */
    counter-increment: section;
}

h1{
    page: contents; /* これで上の @page contents が有効になる */
}

h1::before {
    font-size: 20Q;
    line-height: 1.5lh;
    content : "第" counter(section) "章　";
    margin-block-end: 0.5em;
}

h2::before {
    font-size: 20Q;
    content: counter(section) "." counter(subsection) " ";
}

h3::before {
    font-size: 16Q;
    content: counter(section) "." counter(subsection) "." counter(subsubsection) " ";
}
```

### 図・コード

Markdownでは`![文字列](ファイル名)`で画像が表示できる。
しかしこれは1枚単独のときと，2枚以上（あるいは段落中）を連続するときで状況が違う。
1枚単独のときは`figure`要素になり，`figcaption`もつくのだが（コード6，7），
2枚以上になると`p`要素に入れられることになる（コード8，9）。

```HTML title=単独の画像
![文字列](images/wata2012.png)
```
```HTML title=コード6で生成されるHTML
<figure>
<img src="images/wata2012.png" alt="文字列">
<figcaption aria-hidden="true">文字列</figcaption>
</figure>
```

```HTML title=2枚連続する画像
![文字列](images/wata2012.png)
![文字列](images/wata2012.png)
```
```HTML title=コード8で生成されるHTML
<p>
<img src="images/wata2012.png" alt="文字列">
<img src="images/wata2012.png" alt="文字列">
</p>
```

同様にバッククォート3つで挟んでコードを書いたときにも`title`が`figcaption`として表示される（コード10，11）。
なお細かいことではあるが，図の`figcaption`は最終行に，コードでは上に先頭行に挿入されることに注意されたい。

~~~Markdown title=コードを書く
```C title=こんにちは世界
fprint("Hello, World.\n");
```
~~~

```HTML title=コード10で生成されるHTML
<figure class="language-C">
    <figcaption>こんにちは世界</figcaption>
    <pre class="language-C"><code class="language-C">fprint("Hello, World.\n");</code></pre>
</figure>
```

```CSS title=contents.css（その2）
img {
    max-inline-size: 100%;
    border: none;
    display: block;
}

figure{
    margin-inline: 0;
}

figure:has(img) {
    margin-block: 0 1em;    /* 上下 */
}

figure:has(pre){
    margin-block: 0;  /* 上下 */
}

figure:has(img) figcaption::before {
    content: "図" counter(figure-counter) "：";
    counter-increment: figure-counter;
}

figure:has(pre) figcaption::before {
    content: "コード" counter(code-counter) "：";
    counter-increment: code-counter;
}

figcaption{
    position: relative;
    text-align: left;
    display: inline;
    background-color: white;
    border: solid #000 0.3mm;
    font-family: var(--monospace-font);
    top: 0.7em;
    left: 0;
    margin: 0;
    padding: 0 0.5em;
    font-size: 10Q;
    line-height: 1.4em;
}
```

表についても同じようにしたいのだが，
MarkdownよりもHTMLの方が自由な書き方ができるし，
`figure`要素が使われるわけでもないので今回は見送った。

小技ではあるが，短いコードをページ幅半分で書くために，
バッククォート3つのあとに`left`，`right`とすると左や右に張り付くようにもした。

```CSS title=contents.css（その3）
figure.language-left{
    width: 49%;
    float: inline-start;
}

figure.language-right{
    width: 49%;
    float: inline-end;
}

figure.language-right + *{
    clear: both;
}
```

なお，これまで用いてきた，
コードを1行ずつ網掛けにする方法は1.2にあげた『Web技術で…』のパクリである。
`line-height`と`repeating-linear-gradient`の幅を揃えることで実現している。

```CSS title=contents.css（その4）
pre {
    white-space: pre-wrap;          /* スペースを詰めず，行折返しあり */
    line-break: anywhere;           /* 禁則無効 */
    letter-spacing: none;           /* 無効化 */
    font-size: 12Q;
    line-height: 16Q;
    border: solid 0.3mm #000;
    padding-block: 1mm;             
    padding-inline: 1.5mm;          /* 左右 */
    margin-block: 1mm;              /* 上下 */
    margin-inline: 0;               /* 左右 */
    background: repeating-linear-gradient(180deg, 
        #eee 0Q, #eee 16Q, #fff 16Q, #fff 32Q);
    background-position-y: 1.4mm;
}
```

---

### 箇条書き

`ul`や`ol`については特別な設定をしていないが，
`dl`は`dt`と`dd`が別の行になるのがイヤなので手を入れている。
どうして素の状態はあのような表示になっているんだろう。

```CSS title=contents.css（その5）
ul, ol {
    margin-block-start: 0;
    padding-block-start: 0;
    margin-block-end: 0;
    padding-block-end: 0;
}

dl {
    display: grid;
    column-gap: 1em;
    grid-template-columns: [key] minmax(8em, min-content) [value] 1fr;
}
  
dl dt {
    grid-column: key;
    white-space: nowrap;
}
  
dl dd {
    grid-column: value;
    margin-left: 0;
}
```

### 表

Markdownでも表は書けるが，HTMLで直接書く方が自由度が高いのでそのようにしている（4.2.2）。
筆者がMarkdown推しなのは，文章を書くときにマークアップの作業が思考の邪魔になることを嫌ってのことなので，表作成のようにどうしても思考を中断してレイアウトしなくてはいけないものを苦労してMarkdownで書くことにメリットを感じない。

---

たとえば最近作った別の本は次のような指定ができるようにした。
`mytable`クラスの表は，`td`，`th`要素のクラスを`colN`にすることで`N`em幅になり，
`tr`要素を`noborder`クラスにすることで上の罫線を非表示にできるというものである。
表形式で長い説明を書くためにこのようにしたのであった。

```CSS title=contents.css（その6）
table.mytable{
    table-layout: fixed;
    width: 100%;
    border: solid black 1px;
    border-collapse: collapse;
}

table.mytable td, table.mytable th{
    padding-left: 0.5em;
    border-top: solid lightgray 0.5px;
    /* border-bottom: solid lightgray 0.5px; */
    border-spacing: 2px;
}

table.mytable tr.noborder td, table.mytable tr.noborder th{
    border-top: none;
}

.mytable .col4{
    width: 4em;
}
.mytable .col6{
    width: 6em;
}
（同様にcol20まで作ってあるが省略）
```

```HTML title=表のHTML
<table class="mytable">
    <tr><td class="col10">幅10のカラム</td><td>残り</td></tr>
    <tr><td>とてもとてもとてもとてもとてもとてもとてもとても長い用語</td>
        <td>指定幅で折り返し</td></tr>
    <tr><td>用語1</td><td>説明</td></tr>
    <tr><td>用語2</td><td>説明の1行目</td></tr>
    <tr class="noborder"><td></td><td>説明の2行目は上罫線を消す</td></tr>
</table>
```

これで作ったコード17の表は次のようになる。このような感じで必要に応じて場当たり的にCSSに手を加えている。

<table class="mytable">
    <tr><td class="col10">幅10のカラム</td><td>残り</td></tr>
    <tr><td>とてもとてもとてもとてもとてもとてもとてもとても長い用語</td>
        <td>指定幅で折り返し</td></tr>
    <tr><td>用語1</td><td>説明</td></tr>
    <tr><td>用語2</td><td>説明の1行目</td></tr>
    <tr class="noborder"><td></td><td>説明の2行目は上罫線を消す</td></tr>
</table>

---

### 脚注・その他

脚注<span class="notetext">基本的には脱線なので控えるべきだとは思っているが，
つい使ってしまう。</span>についても書籍『Web技術で…』の掲載コードをそのまま使っている。
`float: footnote`を指定した要素はページ下に脚注として表示されるようになっているので，脚注部分を「`<span class="notetext">脚注テキスト</span>`」というように`span`要素でクラスを使って指定すればいい（クラス名が`footnote`だとカウンタ名などとかぶるのでここでは`notetext`にしているらしい）。

また，`hr`要素（Markdownでは`---`のように書く）を改ページの代わりに使っている。
これは下のCSSのように`break-before: page`すればいいだけなので適当なブロック要素を使ってもいいのだが，
入力が楽なのでこのようにしている。

```CSS title=contents.css（その7）
.notetext{
    float: footnote;
    font-size: 12Q;
    line-height: 16Q;
    text-indent: 0;
}

::footnote-marker{  /* 脚注の行頭マーカー */
    content: counter(footnote) ") ";
}

::footnote-call{    /* 本文中の脚注コール */
    content: " " counter(footnote) ") ";
    font-size: 0.7em;
    position: relative;
    inset-block-start: -0.5em;
}

hr{
    break-before: page;
    visibility: hidden;
}
```

## `toc.css`

目次用のCSSである。Vivliostyleには標準で目次を作る機能があるのだが，
そのための設定を整えるよりも自分で作ってしまった方が好みに合いそうだということでこのようにしている。

`toc.py`で生成される`toc.md`は次のような形式である。
`toc-section`，`toc-subsection`，`toc-subsubsection`は`toc.py`の`classname`で指定したクラス名であり，これらのクラス名がついていることを前提にCSSを作成すればいい。

<!-- どこまでの階層を表示するかは`toc.py`のコードと照らし合わせて決めることになるだろう。
実際にはある程度深いところまで作っておけばいいと考えている。
ないものを表示することはできないが，あるものの表示を抑制するのは簡単なことだからだ。 -->

```md title=toc.mdの例
<nav id="toc" role="doc-toc">

# 目次

- [本書について](section01.html#本書について){.toc-section}
    - [Vivliostyleに出会うまで](section01.html#vivliostyleに出会うまで){.toc-subsection}
（中略）
- [CSS](section04.html#css){.toc-section}
    - [`common.css`](section04.html#commoncss){.toc-subsection}
        - [フォントの準備](section04.html#フォントの準備){.toc-subsubsection}
        - [余白](section04.html#余白){.toc-subsubsection}
```

ここでの章番号カウンタは，
実際の章番号と干渉しないように別系統のカウンタ名（`toc_`を前置）にしている。
CSSでカウントするのが正しいのかは考えが分かれるところだと思う。
たとえば`toc.py`で章番号まで出力しておいて，
それをCSSで表示したりしなかったりする，
というやり方が自然なのかもしれない。

```CSS title=toc.css（その1）
@charset "UTF-8";

body{
    counter-reset: toc_section; /* 目次内のsection番号 */
}

ul {
    list-style: none;           /* マーカーや左空きを消す */
    margin-inline-start: 0;
    padding-inline-start: 0;
}
```

あとは具体的な表示方法を指定することになる。
まずカウンタの制御と，基本的な書式について記述し，
続いて章番号の表示方法を示す。
表示の幅を固定するのであれば`inline-size`などの設定が必要だとは思うが，
そのあたりは必要になってからでいいと考えている。

```CSS title=toc.css（その2）
.toc-section {
    counter-increment: toc_section;
    counter-reset: toc_subsection;
    font-size: 16Q;
    line-height: 1.2em;
}

.toc-subsection{
    counter-increment: toc_subsection;
    counter-reset: toc_subsubsection;
    font-size: 14Q;
    line-height: 1.2em;
    margin-inline-start: 6mm;
}

.toc-subsubsection {
    counter-increment: toc_subsubsection;
    font-size: 14Q;
    line-height: 1.2em;
    margin-inline-start: 12mm;
}

.toc-section::before {
    content: "第" counter(toc_section) "章　";
    display: inline-block;
}

.toc-subsection::before {
    content: counter(toc_section) "." counter(toc_subsection) "　";
    display: inline-block;
}

.toc-subsubsection::before {
    content: counter(toc_section) "." counter(toc_subsection) "." counter(toc_subsubsection) "　";
    display: inline-block;
}
```
---

最後にページ番号の表示を追加する。ここではドットによるリーダをつけてある。

```CSS title=toc.css（その3）
.toc-section::after, .toc-subsection::after, .toc-subsubsection::after {
    font-size: 10Q;
    font-family: var(--monospace-font);
    content: leader(dotted) " " target-counter(attr(href url), page);
    margin-inline-start: 0.5em;
}

li code {   /* タイトルのcode要素が少し小ぶりに見えるので調整 */
    font-size: 105%;
}
```

## `colophon.css`

奥付である。
好きなようにレイアウトすればいいとは思うのだが，
とりあえずの雛形を作っておくと何かと気が楽な気がする。
また，この部分についてはMarkdownでわかりやすく書くのがかえって面倒にも思われるので，
拡張子は`.md`であるにも関わらず，HTMLを直接書いている。

まずページ全体に関する設定をしておく。奥付ではページ数の表示は行いたくないので，
`common.css`で設定しているその表示をキャンセルしている。

```CSS title=colophon.css（その1）
@charset "UTF-8";

@page {
    @bottom-center {                        /* 奥付はページ番号なし */
        content: none;
    }
}

body{
    height: 100%;
    margin: 0;
}
```

多くの本に倣って，ページ上部を著者に関する情報，下部を本に関する情報にすることにした。
それぞれ`id`を`author-info`，`book-info`とし，それぞれについてCSSを作成していく。

---
これが`author-info`の部分。

```CSS title=colophon.css（その2）
:has(#author-info){
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

#author-info h1{
    font-size: 16Q;
    border: none;
}

#author-info h1::before{
    content: "[";
}

#author-info h1::after{
    content: "]";
}

#author-info p {
    line-height: 1.8em;
    text-indent: 0;
}

#author-info dl {
    margin-block-start: 0mm;
    display: grid;
    grid-template-columns: 6em auto;
    column-gap: 1em;
    row-gap: 0mm;
}

#author-info dl dt {
    margin: 0;
}

#author-info dl dd {
    margin: 0;
}
```
---
そしてこれが`book-info`の部分である。

```CSS title=colophon.css（その3）
#book-info dl{
    display: grid;
    grid-template-columns: 4em 4em auto;
    column-gap: 1em;
    row-gap: 1mm;
}

#book-info dt {
    grid-column: 1/2;
    text-align-last: justify;
    margin: 0;
}

#book-info dd {
    grid-column: 2/4;
    margin: 0;
}

#book-info dt.title {
    grid-column: 1/4;
    font-size: 18Q;
    line-height: 1.5em;
    border-block-end: solid 0.5mm #000;
    padding-block-end: 2mm;
    margin-block-end: 2mm;
    text-align-last: left;
}

#book-info dt.title::after{ /* タイトルは自動的に差し込む */
    content: env(pub-title);
}

#book-info dt.publish {
    grid-column: 1/3;
}

#book-info dt.publish + dd{
    grid-column: 3/4;
}
```

---

`book-info`は図3のようなグリッドレイアウトにしている。
コード26に`colophon.md`の例を示す。

![奥付のレイアウト](images/colophon.png){width=30%}

```HTML title=colophon.md
<div id="author-info">
    <h1>著者について</h1>
    <p><img src="images/wata2012.png" alt=""></p>
    <p>わたやんというのがどんな人物かというと…</p>
    <dl>
        <dt>Web site</dt><dd><code>https://watayan.net</code></dd>
        ...
    </dl>
</div>

<div id="book-info">
    <dl>
        <dt class="title"></dt>
        <dt class="publish">2025年5月31日</dt><dd>初版発行</dd>
        <dt>著者</dt><dd>わたやん</dd>
        ...
    </dl>
</div>
```