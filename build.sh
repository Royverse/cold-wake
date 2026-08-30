#!/bin/sh
cd "$(dirname "$0")"
cat parts/p01.html parts/p02.html parts/p03.html parts/p04.html parts/p05.html parts/p06.html \
    parts/p07.html parts/p08.html parts/p09.html parts/p10.html parts/p11.html parts/p12.html \
    parts/p13.html parts/p14.html parts/p15.html parts/p16.html parts/p17.html > single.html
node -e "
const fs=require('fs');
const s=fs.readFileSync('single.html','utf8');
const a=s.indexOf('<script>')+8, b=s.lastIndexOf('</'+'script>');
try{ new Function(s.slice(a,b)); console.log('build ok  '+s.length+' bytes'); }
catch(e){ console.log('SYNTAX ERROR: '+e.message); process.exit(1); }
"
