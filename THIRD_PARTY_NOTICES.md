# Third-party notices

The Bell of Ages bundles the following open-source code in its web build. Their
license texts are reproduced below.

| Component | Version | License | Used for |
| --- | --- | --- | --- |
| [three.js](https://threejs.org/) (including `three/addons`: GLTFLoader, EffectComposer, GTAOPass, FXAA, RoomEnvironment, BufferGeometryUtils) | 0.186.1 | MIT | Rendering, model loading, post-processing |
| [meshoptimizer](https://github.com/zeux/meshoptimizer) (decoder) | 1.3.0 | MIT | Decoding the compressed model pack |

The web build also bundles two fonts, Latin subsets only, packaged by [Fontsource](https://fontsource.org/):

| Font | Package | Version | License |
| --- | --- | --- | --- |
| [Cormorant Garamond](https://github.com/CatharsisFonts/Cormorant) (400, 500, 600; italic 400, 500) | `@fontsource/cormorant-garamond` | 5.3.0 | SIL Open Font License 1.1 |
| [DM Sans](https://github.com/googlefonts/dm-fonts) (400, 500, 600, 700) | `@fontsource/dm-sans` | 5.3.0 | SIL Open Font License 1.1 |

Their copyright notices and the full license text ship with the build as `licenses/fonts-OFL.txt` (source: `public/licenses/fonts-OFL.txt`). No font is requested from a third-party server.

Development-only tools (Vite, Vitest, TypeScript, glTF Transform, gltf-validator, sharp, Prettier, Playwright, Blender) are not redistributed in the build. See `package.json` for their versions.

---

## three.js

```
The MIT License

Copyright © 2010-2026 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

## meshoptimizer

```
MIT License

Copyright (c) 2016-2026 Arseny Kapoulkine

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
