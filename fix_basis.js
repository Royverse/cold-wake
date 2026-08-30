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

fixFile('parts/p11.html', [
  [
    "this.right[0] = cos(camYawW); this.right[1] = 0; this.right[2] = -sin(camYawW);\n    this.up = V3.norm(V3.cross(this.fwd, this.right));      // right handed: up = fwd x right",
    "this.right[0] = -cos(camYawW); this.right[1] = 0; this.right[2] = sin(camYawW);\n    this.up = V3.norm(V3.cross(this.right, this.fwd));"
  ],
  [
    "this.right = V3.norm(V3.cross(this.up, this.fwd));      // right = up x fwd",
    "this.right = V3.norm(V3.cross(this.fwd, this.up));"
  ]
]);

fixFile('parts/p14.html', [
  [
    "Cam.right = V3.norm(V3.cross(Cam.up, Cam.fwd));\n    Cam.up = V3.norm(V3.cross(Cam.fwd, Cam.right));",
    "Cam.right = V3.norm(V3.cross(Cam.fwd, Cam.up));\n    Cam.up = V3.norm(V3.cross(Cam.right, Cam.fwd));"
  ]
]);

fixFile('parts/p17.html', [
  [
    "Cam.right = V3.norm(V3.cross([0, 1, 0], Cam.fwd));\n      Cam.up = V3.norm(V3.cross(Cam.fwd, Cam.right));",
    "Cam.right = V3.norm(V3.cross(Cam.fwd, [0, 1, 0]));\n      Cam.up = V3.norm(V3.cross(Cam.right, Cam.fwd));"
  ],
  [
    "Cam.right = V3.norm(V3.cross([0, 1, 0], Cam.fwd));\n    Cam.up = V3.norm(V3.cross(Cam.fwd, Cam.right));",
    "Cam.right = V3.norm(V3.cross(Cam.fwd, [0, 1, 0]));\n    Cam.up = V3.norm(V3.cross(Cam.right, Cam.fwd));"
  ]
]);

console.log('Fixed basis vectors.');
