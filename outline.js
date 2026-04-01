const level = 1;    // 1ファイルにするのはoutline.mdの何階層にするか。

const fs = require('fs');

function makeTopic() {
    const globSimple = pattern =>
        fs.readdirSync('.').filter(file => 
            new RegExp(pattern).test(file)
        );
    // 既にtopic*.mdが存在する場合は処理を中止する
    if(globSimple('^topic\\d\\d\\.md$').length > 0) {
        console.error('Error: 既にtopic*.mdが存在するので中止します。');
        return;
    }
    
    const lines = fs.readFileSync('outline.md', 'utf8').split('\n');
    var indentLength = 0;
    var topics = [];
    var preLevel = 100;
    for(var line of lines) {
        const match = line.match(/^(\s*)[\-\*]\s+(.*)/);
        if(match) {
            const indent = match[1].length;
            const title = match[2];
            if(indent > 0 && indentLength == 0) indentLength = indent;
            const currentLevel = indentLength > 0 ? indent / indentLength : 0;
            if(currentLevel < level && preLevel >= level) topics.push([]);
            topics.at(-1).push('#'.repeat(currentLevel + 1) + ' ' + title);
            preLevel = currentLevel;
        }
    }
    for(var titles of topics) {
        const topicFile = `topic${(topics.indexOf(titles) + 1).toString().padStart(2, '0')}.md`;
        fs.writeFileSync(topicFile, titles.join('\n\n') + '\n');
        console.log(`Created ${topicFile}`);
    }
}

makeTopic();
