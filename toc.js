const maxLevel = 2; // 目次に含める見出しの最大レベル

const fs = require('fs');

function makeToc() 
{
    const header = '<nav id="toc" role="doc-toc">\n\n## 目次\n\n';
    const footer = '\n\n</nav>\n\n' +
                '---\n\n' +     // 免責事項を別ページにしないときはこの行を削除
`
### 免責事項

- 本書の内容は今後予告なく変更されることがあります。
- 本書の内容に関する質問や誤りの指摘は歓迎しますが，必ずしも対応できるとは限りません。
- 本書の内容を利用して発生したいかなる損害についても，著者は一切責任を負いません。
`;
    const globSimple = pattern =>
        fs.readdirSync('.').filter(file => 
            new RegExp(pattern).test(file)
        );
    const contentsFiles = globSimple('^topic\\d\\d\\.md$').sort();
    var tocContent = '';
    for(var contentFile of contentsFiles) {
        const content = fs.readFileSync(contentFile, 'utf8');
        const lines = content.split('\n');
        let preFlag = false;                // コードブロックの中かどうか
        const htmlFile = contentFile.replace('.md', '.html');
        for(var line of lines) {
            if(/^[~`]{3}/.test(line)) {     // コードブロックの開始/終了
                preFlag = !preFlag;
            }
            // 1〜maxLevelレベルの見出しを抽出
            const match = line.match(new RegExp(`^(#{1,${maxLevel}})\\s+(.*)`));
            if(match && !preFlag) {
                const level = match[1].length - 1;
                const title = match[2];
                let id = title.toLowerCase()
                    .replace(/[<>，\[「」・（）"`'\./]/g, '')   // 除去される文字
                    .replace(/[ ]/g, '-');                      // 空白→ハイフン
                const indent = '    '.repeat(level);
                tocContent += `${indent}- [${title}](${htmlFile}#${id}){.toc-level${level + 1}}\n`;
            }
        }
    }
    tocContent = header + tocContent + footer;
    fs.writeFileSync('toc.md', tocContent);
    console.log('Generated toc.md successfully');
}

makeToc();
