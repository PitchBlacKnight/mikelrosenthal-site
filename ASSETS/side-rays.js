/*
 * SideRays — dependency-free WebGL light-ray background.
 * Ported from React Bits "SideRays" by David Haz (MIT + Commons Clause),
 * https://github.com/DavidHDev/react-bits — rewritten as plain WebGL, no React/ogl.
 *
 * Usage:
 *   <div data-side-rays
 *        data-ray-color1="#EAB308" data-ray-color2="#96c8ff"
 *        data-origin="top-right" data-speed="2.5" data-intensity="2"
 *        data-spread="2" data-tilt="0" data-saturation="1.5"
 *        data-blend="0.75" data-falloff="1.6" data-opacity="1"></div>
 *   <script src="/ASSETS/side-rays.js" defer></script>
 *
 * Page-load safeguards:
 *   - starts after the page is idle, and only once the element is on screen
 *   - pauses when scrolled offscreen or the tab is hidden
 *   - prefers-reduced-motion: renders one still frame, no animation
 *   - pixel ratio capped at 1.5; no WebGL → element simply stays empty
 */
(function () {
  'use strict';

  var DEFAULTS = {
    rayColor1: '#EAB308', rayColor2: '#96c8ff', origin: 'top-right',
    speed: 2.5, intensity: 2, spread: 2, tilt: 0, saturation: 1.5,
    blend: 0.75, falloff: 1.6, opacity: 1
  };
  var MAX_DPR = 1.5;

  var VERT = 'attribute vec2 position;void main(){gl_Position=vec4(position,0.0,1.0);}';

  var FRAG = [
    'precision highp float;',
    'uniform float iTime;uniform vec2 iResolution;uniform float iSpeed;',
    'uniform vec3 iRayColor1;uniform vec3 iRayColor2;uniform float iIntensity;',
    'uniform float iSpread;uniform float iFlipX;uniform float iFlipY;uniform float iTilt;',
    'uniform float iSaturation;uniform float iBlend;uniform float iFalloff;uniform float iOpacity;',
    'float rayStrength(vec2 src,vec2 dir,vec2 coord,float a,float b,float speed){',
    '  vec2 d=coord-src;float c=dot(normalize(d),dir);',
    '  return clamp((0.45+0.15*sin(c*a+iTime*speed))+(0.3+0.2*cos(-c*b+iTime*speed)),0.0,1.0)*',
    '    clamp((iResolution.x-length(d))/iResolution.x,0.5,1.0);',
    '}',
    'void main(){',
    '  vec2 fc=gl_FragCoord.xy;',
    '  if(iFlipX>0.5)fc.x=iResolution.x-fc.x;',
    '  if(iFlipY>0.5)fc.y=iResolution.y-fc.y;',
    '  vec2 coord=vec2(fc.x,iResolution.y-fc.y);',
    '  vec2 rayPos=vec2(iResolution.x*1.1,-0.5*iResolution.y);',
    '  float t=iTilt*3.14159265/180.0;float cs=cos(t);float sn=sin(t);',
    '  vec2 rel=coord-rayPos;',
    '  vec2 tc=vec2(rel.x*cs-rel.y*sn,rel.x*sn+rel.y*cs)+rayPos;',
    '  float hs=iSpread*0.275;',
    '  vec2 d1=normalize(vec2(cos(0.785398+hs),sin(0.785398+hs)));',
    '  vec2 d2=normalize(vec2(cos(0.785398-hs),sin(0.785398-hs)));',
    '  vec4 r1=vec4(iRayColor1,1.0)*rayStrength(rayPos,d1,tc,36.2214,21.11349,iSpeed);',
    '  vec4 r2=vec4(iRayColor2,1.0)*rayStrength(rayPos,d2,tc,22.3991,18.0234,iSpeed*0.2);',
    '  vec4 color=r1*(1.0-iBlend)*0.9+r2*iBlend*0.9;',
    '  float dist=length(fc.xy-vec2(rayPos.x,iResolution.y-rayPos.y))/iResolution.y;',
    '  color.rgb*=iIntensity*0.4/pow(max(dist,0.001),iFalloff);',
    '  float g=dot(color.rgb,vec3(0.299,0.587,0.114));',
    '  color.rgb=mix(vec3(g),color.rgb,iSaturation);',
    '  color.a=max(color.r,max(color.g,color.b))*iOpacity;',
    '  gl_FragColor=color;',
    '}'
  ].join('\n');

  function hexToRgb(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
    return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
  }

  function originToFlip(o) {
    switch (o) {
      case 'top-left': return [1, 0];
      case 'bottom-right': return [0, 1];
      case 'bottom-left': return [1, 1];
      default: return [0, 0];
    }
  }

  function readOptions(el) {
    var d = el.dataset, o = {};
    for (var k in DEFAULTS) {
      var v = d[k];
      if (v === undefined) o[k] = DEFAULTS[k];
      else o[k] = typeof DEFAULTS[k] === 'number' ? parseFloat(v) : v;
    }
    return o;
  }

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
    return s;
  }

  function SideRays(el, opts) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;';
    var gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'low-power' });
    if (!gl) return null;

    var vs = compile(gl, gl.VERTEX_SHADER, VERT), fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);

    // One oversized triangle covers the viewport.
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.clearColor(0, 0, 0, 0);

    var u = {};
    ['iTime', 'iResolution', 'iSpeed', 'iRayColor1', 'iRayColor2', 'iIntensity', 'iSpread',
     'iFlipX', 'iFlipY', 'iTilt', 'iSaturation', 'iBlend', 'iFalloff', 'iOpacity']
      .forEach(function (n) { u[n] = gl.getUniformLocation(prog, n); });

    var flip = originToFlip(opts.origin);
    gl.uniform1f(u.iSpeed, opts.speed);
    gl.uniform3fv(u.iRayColor1, hexToRgb(opts.rayColor1));
    gl.uniform3fv(u.iRayColor2, hexToRgb(opts.rayColor2));
    gl.uniform1f(u.iIntensity, opts.intensity);
    gl.uniform1f(u.iSpread, opts.spread);
    gl.uniform1f(u.iFlipX, flip[0]);
    gl.uniform1f(u.iFlipY, flip[1]);
    gl.uniform1f(u.iTilt, opts.tilt);
    gl.uniform1f(u.iSaturation, opts.saturation);
    gl.uniform1f(u.iBlend, opts.blend);
    gl.uniform1f(u.iFalloff, opts.falloff);
    gl.uniform1f(u.iOpacity, opts.opacity);

    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.appendChild(canvas);

    var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var raf = 0, onScreen = false, start = performance.now(), frozenAt = 0;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      var w = Math.max(1, Math.round(el.clientWidth * dpr));
      var h = Math.max(1, Math.round(el.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(u.iResolution, w, h);
      }
    }

    function draw(seconds) {
      resize();
      gl.uniform1f(u.iTime, seconds);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function frame(now) {
      draw((now - start) * 0.001);
      raf = requestAnimationFrame(frame);
    }

    function play() {
      if (raf || reduced || !onScreen || document.hidden) return;
      start = performance.now() - frozenAt * 1000; // resume where it paused
      raf = requestAnimationFrame(frame);
    }

    function pause() {
      if (!raf) return;
      cancelAnimationFrame(raf); raf = 0;
      frozenAt = (performance.now() - start) * 0.001;
    }

    var io = new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      if (onScreen) { if (reduced) draw(1.5); else play(); } else pause();
    }, { threshold: 0 });
    io.observe(el);

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) pause(); else play();
    });

    var ro = new ResizeObserver(function () { if (reduced || !raf) draw(reduced ? 1.5 : frozenAt); });
    ro.observe(el);

    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); pause(); });

    return { play: play, pause: pause };
  }

  function init() {
    var els = document.querySelectorAll('[data-side-rays]');
    for (var i = 0; i < els.length; i++) {
      if (els[i].__sideRays) continue;
      els[i].__sideRays = SideRays(els[i], readOptions(els[i])) || true;
    }
  }

  window.SideRays = { init: init, mount: function (el, o) { return SideRays(el, Object.assign({}, DEFAULTS, o)); } };

  // Wait until the page has painted and gone idle so the effect never competes with content.
  function whenIdle() {
    if ('requestIdleCallback' in window) requestIdleCallback(init, { timeout: 1500 });
    else setTimeout(init, 200);
  }
  if (document.readyState === 'complete') whenIdle();
  else window.addEventListener('load', whenIdle);
})();
