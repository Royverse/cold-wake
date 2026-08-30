const fs=require('fs');
const E=(f,pairs)=>{let s=fs.readFileSync(f,'utf8');let ok=true;
  for(const[a,b]of pairs){ if(s.indexOf(a)<0){console.log('MISS '+f+': '+a.slice(0,52)); ok=false; continue;} s=s.split(a).join(b); }
  fs.writeFileSync(f,s); return ok;};

E('parts/p11.html',[
 ["    // world +X lies to the camera's left, so D steers with a negative yaw rate\n    const steer = active ? (input.k('KeyA') ? 1 : 0) - (input.k('KeyD') ? 1 : 0) : 0;",
  "    const steer = active ? (input.k('KeyD') ? 1 : 0) - (input.k('KeyA') ? 1 : 0) : 0;"],
 ["    this.right[0] = -cos(camYawW); this.right[1] = 0; this.right[2] = sin(camYawW);\n    this.up = V3.norm(V3.cross(this.right, this.fwd));",
  "    this.right[0] = cos(camYawW); this.right[1] = 0; this.right[2] = -sin(camYawW);\n    this.up = V3.norm(V3.cross(this.fwd, this.right));      // right handed: up = fwd x right"],
 ["    this.right = V3.norm(V3.cross(this.fwd, this.up));",
  "    this.right = V3.norm(V3.cross(this.up, this.fwd));      // right = up x fwd"],
]);

E('parts/p14.html',[
 ["    Cam.right = V3.norm(V3.cross(Cam.fwd, Cam.up));\n    Cam.up = V3.norm(V3.cross(Cam.right, Cam.fwd));",
  "    Cam.right = V3.norm(V3.cross(Cam.up, Cam.fwd));\n    Cam.up = V3.norm(V3.cross(Cam.fwd, Cam.right));"],
]);

E('parts/p17.html',[
 ["      Cam.right = V3.norm(V3.cross(Cam.fwd, [0, 1, 0]));\n      Cam.up = V3.norm(V3.cross(Cam.right, Cam.fwd));",
  "      Cam.right = V3.norm(V3.cross([0, 1, 0], Cam.fwd));\n      Cam.up = V3.norm(V3.cross(Cam.fwd, Cam.right));"],
 ["    Cam.right = V3.norm(V3.cross(Cam.fwd, [0, 1, 0]));\n    Cam.up = V3.norm(V3.cross(Cam.right, Cam.fwd));",
  "    Cam.right = V3.norm(V3.cross([0, 1, 0], Cam.fwd));\n    Cam.up = V3.norm(V3.cross(Cam.fwd, Cam.right));"],
]);

E('parts/p15.html',[
 ["    let src = (-yaw * this._ppr - W / 2) % total;","    let src = (yaw * this._ppr - W / 2) % total;"],
 ["      const px = W / 2 - ab * ppr;","      const px = W / 2 + ab * ppr;"],
 ["        d.el.style.transform = 'rotate(' + (-d.a * 180 / PI) + 'deg)';",
  "        d.el.style.transform = 'rotate(' + (d.a * 180 / PI) + 'deg)';"],
]);

E('parts/p16.html',[
 ["    M4.compose(lhL, [.44, -.02, .02], .10, -.12, -.18, 1, 1, 1);","    M4.compose(lhL, [-.44, -.02, .02], .10, .12, .18, 1, 1, 1);"],
]);
console.log('revert done');
