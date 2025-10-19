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
            if re.match(r"^[~`]{3}", l): # ```や~~~で始まる行
                pre_flag = not pre_flag
            info = re.match(r"^(#{1,3})\s+(.*)", l) # 1〜3レベルの見出し
            if(info and not pre_flag):
                level = len(info[1]) - 1        # 見出しレベル - 1
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
