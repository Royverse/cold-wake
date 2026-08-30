const fs = require('fs');

function fixFile(file, replaces) {
  let content = fs.readFileSync(file, 'utf8');
  let ok = true;
  for (let [a, b] of replaces) {
    if (content.indexOf(a) === -1) {
      console.log('NOT FOUND in ' + file + ':\n' + a);
      ok = false;
    } else {
      content = content.replace(a, b);
    }
  }
  if (ok) fs.writeFileSync(file, content);
}

fixFile('parts/p15.html', [
  [
    "let src = (yaw * this._ppr - W / 2) % total;",
    "let src = (-yaw * this._ppr - W / 2) % total;"
  ],
  [
    "const px = W / 2 + ab * ppr;",
    "const px = W / 2 - ab * ppr;"
  ],
  [
    "d.el.style.transform = 'rotate(' + (d.a * 180 / PI) + 'deg)';",
    "d.el.style.transform = 'rotate(' + (-d.a * 180 / PI) + 'deg)';"
  ]
]);

fixFile('parts/p16.html', [
  [
    "M4.compose(lhL, [-.44, -.02, .02], .10, .12, .18, 1, 1, 1);",
    "M4.compose(lhL, [.44, -.02, .02], .10, -.12, -.18, 1, 1, 1);"
  ]
]);

console.log('Fixed UI/HUD flips.');
