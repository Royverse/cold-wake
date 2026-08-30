const http=require('http'),fs=require('fs'),p=require('path');
const root=__dirname;
http.createServer((q,r)=>{
  let f=decodeURIComponent(q.url.split('?')[0]);
  if(f==='/')f='/single.html';
  const fp=p.join(root,f);
  fs.readFile(fp,(e,d)=>{
    if(e){r.writeHead(404);r.end('nf');return;}
    const ext=p.extname(fp);
    const t=ext==='.html'?'text/html':ext==='.js'?'text/javascript':'text/plain';
    r.writeHead(200,{'Content-Type':t,'Cache-Control':'no-store'});r.end(d);
  });
}).listen(8712,()=>console.log('serving on 8712'));
