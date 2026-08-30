/* headless test harness - not part of the shipped game */
(function () {
  window.__rafQ = [];
  window.requestAnimationFrame = cb => { window.__rafQ.push(cb); return 1; };
  window.__log = [];

  window.__dmg = {};
  window.__hookDamage = function () {
    if (Player.__hooked) return;
    const base = Player.damage;
    Player.damage = function (amt, from, silent) {
      const l = ((new Error()).stack || '').split(String.fromCharCode(10))[2] || '?';
      const k = l.trim().replace(/^at\s+/, '').replace(/https?:[^ ]*single\.html[^:]*/, 'sh').slice(0, 46);
      __dmg[k] = (__dmg[k] || 0) + amt;
      return base.call(this, amt, from, silent);
    };
    Player.__hooked = 1;
  };
  window.__boot = function () {
    TEX.noise = makeNoiseTex(); TEX.waterN = makeWaterNormalTex(); TEX.sprite = makeSpriteAtlas();
    R.init(); Track.build(); buildMeshes(); Water.build(); Foam.init(); Parts.init(); Snow.init();
    HUD.init(); Director.init(); Input.init();
    Game.reset(); Game.state = 'play'; Game.time = 10;
    __log.length = 0; window.__dmg = {};
    __hookDamage();
    return 'booted';
  };

  window.__bot = {
    mouseDown: false, steer: 0, look: [0, 0],
    k(c) {
      if (c === 'KeyW') return !(this.slow && Player.speed > 26);
      if (c === 'KeyA') return this.steer < -.12;
      if (c === 'KeyD') return this.steer > .12;
      if (c === 'ShiftLeft') return !this.slow && (Game.time % 9) < 2.5;
      return false;
    },
    consumeMouse() { const l = this.look; this.look = [0, 0]; return l; },
    tick() {
      let lat = 0;
      for (const o of Hazards.solids) {
        if (o.dead) continue;
        const ds = o.s - Player.s;
        if (ds > 3 && ds < 60 && Math.abs(o.lat - Player.lat) < 7) lat += (Player.lat > o.lat ? 1 : -1) * 10;
      }
      const W = Track.widthAt(Player.s + 50);
      // ease off through pinches and when something hard is close ahead
      this.slow = W < 17 || Math.abs(Player.lat) > W * .7;
      for (const o of Hazards.solids) {
        if (o.dead || !o.hard) continue;
        const ds = o.s - Player.s;
        if (ds > 0 && ds < 34 && Math.abs(o.lat - Player.lat) < 5) this.slow = true;
      }
      lat = clamp(lat, -W * .6, W * .6);
      const a = Track.toWorld(Player.s + 50, lat);
      const w = atan2(a[0] - Player.x, a[2] - Player.z);
      this.steer = clamp(angDiff(w, Player.yaw) * 2.8, -1, 1);
      let best = null, bd = 1e9;
      for (const e of Enemies.list) {
        if (e.dead) continue;
        const d = Math.hypot(e.x - Player.x, e.z - Player.z);
        if (d < bd && d < 130) { bd = d; best = e; }
      }
      if (best) {
        const want = atan2(best.x - Player.x, best.z - Player.z);
        const dy = angDiff(want, Player.camYawW || Player.yaw);
        const dp = atan2(best.y + .9 - Player.eye[1], bd) - Player.camPitch;
        this.look = [-clamp(dy * 4, -10, 10), -clamp(dp * 4, -5, 5)];
        this.mouseDown = Math.abs(dy) < .1;
      } else this.mouseDown = false;
    }
  };

  window.__sim = function (n, dt) {
    dt = dt || 1 / 60;
    const errs = [];
    for (let i = 0; i < n; i++) {
      try {
        Game.time += dt; Game.elapsed += dt;
        if (Game.invuln > 0) Game.invuln -= dt;
        __bot.tick();
        Player.update(dt, Game.time, __bot, true);
        Gun.update(dt, __bot, Game.time, true);
        Enemies.update(dt, Game.time);
        Hazards.update(dt, Game.time);
        Director.update(dt);
        Parts.update(dt, Game.time);
        Terrain.update(Player.s, 2);
        HUD.update(dt);
        if (Game.exfil && !Game.boat) Game.spawnBoat();
        if (Game.boat && Math.hypot(Game.boat.x - Player.x, Game.boat.z - Player.z) < 26 && !Game.won) {
          Game.won = true;
          __log.push('WIN s=' + (Player.s | 0) + ' t=' + Game.elapsed.toFixed(0));
          return errs;
        }
        if (Player.dead) {
          __log.push('DIED s=' + (Player.s | 0) + ' t=' + Game.elapsed.toFixed(0));
          Director.restore();
        }
      } catch (e) {
        errs.push('ERR i=' + i + ' s=' + (Player.s | 0) + ' :: ' + e.message + ' | ' + (e.stack || '').split('\n')[1]);
        if (errs.length > 3) break;
      }
    }
    return errs;
  };

  window.__stat = function (extra) {
    const o = {
      s: Player.s | 0, t: Game.elapsed.toFixed(0), hull: Player.hull | 0, kmh: (Player.speed * 3.6) | 0,
      beat: Director.next, alive: Enemies.alive(), kills: Game.kills,
      shots: Gun.shots, hits: Gun.hits, deaths: __log.length, log: __log.slice(-3),
      parts: Parts.live.length, solids: Hazards.solids.length, gunship: !!Hazards.gunship,
    };
    if (extra) for (const k in extra) o[k] = extra[k];
    return o;
  };

  window.__pixels = function () {
    Cam.eye = Player.eye; Cam.fwd = Player.fwd; Cam.up = Player.up; Cam.right = Player.right; Cam.fov = Player.fov;
    R.frame(1 / 60); R.frame(1 / 60); gl.finish();
    const w = canvas.width, h = canvas.height, px = new Uint8Array(4);
    const S = (u, v) => { gl.readPixels((u * w) | 0, ((1 - v) * h) | 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); return px[0] + ',' + px[1] + ',' + px[2]; };
    const rows = [];
    for (let v = .07; v < 1; v += .12) {
      const r = [];
      for (let u = .08; u < 1; u += .14) r.push(S(u, v));
      rows.push('v' + v.toFixed(2) + ' ' + r.join(' '));
    }
    return rows;
  };

  window.__timeFrame = function (n) {
    n = n || 20;
    let t = 0;
    for (let i = 0; i < n; i++) {
      const a = performance.now();
      R.frame(1 / 60); gl.finish();
      t += performance.now() - a;
    }
    return (t / n).toFixed(2) + ' ms/frame @' + R.W + 'x' + R.H;
  };
})();

/* jump straight to a mission beat and exercise it */
window.__beat = function (idx, seconds) {
  const b = Director.beats[idx];
  Enemies.clear(); Hazards.init(); Parts.clear(); Game.avalanches.length = 0;
  Game.won = false; Game.boat = null; Game.exfil = idx >= 12;
  Player.reset(Math.max(0, b.s - 120));
  Player.hull = 100; Player.dead = false;
  Director.next = idx;
  for (let i = 0; i < Director.beats.length; i++) Director.beats[i].done = i < idx;
  Director.bridges.length = 0;
  Terrain.update(Player.s, 12);
  const errs = __sim(Math.round((seconds || 25) * 45), 1 / 45);
  return { beat: b.name, errs, s: Player.s | 0, hull: Player.hull | 0, alive: Enemies.alive(),
    solids: Hazards.solids.length, parts: Parts.live.length, gunship: !!Hazards.gunship,
    av: Game.avalanches.length, bridges: Director.bridges.length, won: Game.won, deaths: __log.length };
};
