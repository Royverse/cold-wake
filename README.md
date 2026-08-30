# COLD WAKE // OPERATION WHITEWATER

[![Live Demo](https://img.shields.io/badge/Play_Live-Netlify-00ad9f?style=for-the-badge&logo=netlify)](http://cold-wake-game-1.netlify.app)
[![Tech](https://img.shields.io/badge/Engine-Vanilla_WebGL2-blue?style=for-the-badge&logo=webgl)](http://cold-wake-game-1.netlify.app)
[![Audio](https://img.shields.io/badge/Audio-Web_Audio_API-orange?style=for-the-badge)](http://cold-wake-game-1.netlify.app)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> **"Exfil with the drive. Do not stop."**

**Cold Wake** is a self-contained, asset-less 3D high-speed tactical combat pursuit game built entirely in vanilla WebGL2 and the Web Audio API. Everything—from the fjord spline geometry and terrain normal maps to the particle atlases, water shaders, and 007 spy lo-fi hip-hop soundtrack—is synthesized procedurally in real-time in under 200 KB of code.

---

## 🎮 Play Live

- **Production Deployment**: [http://cold-wake-game-1.netlify.app](http://cold-wake-game-1.netlify.app)
- **Repository**: [https://github.com/Royverse/cold-wake](https://github.com/Royverse/cold-wake)

---

## 🕹️ Controls & Tactical Systems

| Key / Input | Action |
| :--- | :--- |
| **`W` / `S`** | Throttle / Hydrodynamic Brake |
| **`A` / `D`** | Hull steering & lateral carving |
| **`Space`** | Handbrake / Hydroplane Drift |
| **`Shift`** | Jet turbine afterburner boost |
| **`Mouse`** | Precision aim & look |
| **`Left Mouse Button`** | Fire suppressed submachine gun |
| **`R`** | Tactical magazine reload |
| **`V`** | Toggle Third-Person / First-Person Cockpit view |
| **`Esc`** | Pause tactical simulation |
| **`Q`** *(in pause)* | Cycle Graphics Quality (*Auto, Low, Med, High, Ultra*) |
| **`P`** | Toggle live performance telemetry overlay |

---

## ⚙️ Technical Highlights

### 1. Zero External Assets (100% Procedural)
- **Geometry**: Procedural mesh generation for pursuit skis, patrol vessels, gunships, canyon terrain ribbons, and environmental obstacles.
- **Textures**: Procedural noise fields ($fBm$, ridged multifractals, Voronoi) and Gerstner normal maps synthesized during boot into compressed GPU textures.
- **Particle Atlas**: Runtime 2D canvas procedural baking for glow, smoke puffs, water spray, and ice shards.

### 2. Custom WebGL2 Rendering Pipeline
- **Terrain & Water Pass**: Dual-layer Gerstner wave displacement with real-time planar reflections, depth buffer soft water intersections, and wake foam buffers.
- **Post-Processing Stack**: HDR exposure grading, multi-pass Gaussian bloom, motion blur, and atmospheric volumetric depth-fog.
- **Adaptive Performance Scaling**: Dynamic resolution scaler with framerate guardbands targeting solid 60 FPS across desktop and mobile devices.

### 3. Procedural 007 Spy / Lo-Fi Hip-Hop Audio Engine
- **Synthesizer Engine**: Real-time Web Audio graph running an 82 BPM rhythmic spy sequencer.
- **Instrumentation**:
  - Deep 808 sub-kick and swung jazzy rimshot/snare percussions.
  - Signature James Bond chromatic walking bassline ($D \rightarrow D\sharp \rightarrow E \rightarrow D\sharp$).
  - Lush electric piano chords ($Dm9$, $Dm\text{maj7}$, $Dm6$, $B\flat\text{maj7}\sharp11 \rightarrow A7\flat9$).
  - Suppressed weapon acoustics (*"thwip"*), muffled hydrodynamic wash, and warm spatial reverb.

---

## 📁 Architecture & Codebase Layout

The project is structured into modular parts for maintainability and concatenated into a standalone single-file distribution (`single.html` / `index.html`):

```
game/
├── parts/
│   ├── p01.html  # Document head, CSS variables, screen and gauge layer architecture
│   ├── p02.html  # Matrix & vector math (M4/V3), procedural noise, HUD templates
│   ├── p03.html  # WebGL2 context helpers, procedural texture & normal map baking
│   ├── p04.html  # Shared GLSL shader uniforms & vertex shader programs
│   ├── p05.html  # GLSL Fragment shaders (Terrain, Water, Post-FX Bloom/Grade)
│   ├── p06.html  # Canyon spline mathematics, terrain chunk streaming & frustum culling
│   ├── p07.html  # Water mesh clipmap & dynamic wake buffer simulation
│   ├── p08.html  # Procedural 3D mesh synthesis (craft hulls, weapons, obstacles)
│   ├── p09.html  # Instanced particle simulation (snow, spray, sparks, debris)
│   ├── p10.html  # Web Audio engine, procedural 007 theme music & sound effects
│   ├── p11.html  # Player vehicle dynamics, watercraft physics & hitscan gunplay
│   ├── p12.html  # Enemy pursuit AI, corridor tracking, formation & combat logic
│   ├── p13.html  # Environmental colliders (ice falls, fuel drums, gunship boss)
│   ├── p14.html  # Mission director, dynamic pacing & checkpoint management
│   ├── p15.html  # Tactical HUD rendering (compass tape, speedometer, target bracket)
│   ├── p16.html  # Master WebGL2 render pipeline, shadow map, reflections & post
│   └── p17.html  # State machine, boot sequencer, game loop & input coordinator
├── index.html    # Standalone production distribution
├── single.html   # Build artifact
├── serve.js      # Minimal zero-dependency local development server
└── build.sh      # Concatenation build script
```

---

## 🛠️ Local Development & Building

### Running Locally
You can run the game with Node.js:
```bash
node serve.js
```
Then open [http://localhost:8712](http://localhost:8712) in any modern WebGL2-compatible browser (Chrome, Edge, Firefox, Safari).

### Rebuilding the Distribution
To rebuild the self-contained `index.html` from `parts/`:
```bash
node -e "const fs=require('fs'); const parts=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].map(i=>fs.readFileSync('parts/p'+i.toString().padStart(2,'0')+'.html','utf8')).join(''); fs.writeFileSync('single.html', parts); fs.writeFileSync('index.html', parts); console.log('Build complete.');"
```

---

## 📄 License

MIT License — Created and maintained by [Royverse](https://github.com/Royverse). Open source and free for all.
