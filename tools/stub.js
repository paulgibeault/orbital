// Shared headless harness for index.html: fakes just enough DOM/canvas to run the game script in node.
const fs = require('fs');
const noop = () => {};
function makeCtx() {
  return new Proxy({}, {
    get: (t, k) => {
      if (k in t) return t[k];
      if (k === 'measureText') return () => ({ width: 60 });
      if (typeof k === 'string' && /^create.*Gradient$/.test(k)) return () => ({ addColorStop: noop });
      if (k === 'createImageData' || k === 'getImageData') return (w, h) => ({ data: new Uint8ClampedArray((w || 1) * (h || 1) * 4), width: w, height: h });
      if (k === 'createPattern') return () => ({});
      return noop;
    },
    set: (t, k, v) => (t[k] = v, true),
  });
}
function makeEl() {
  const el = { style: { display: 'none' }, innerHTML: '', textContent: '', dataset: {}, children: [],
    classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
    addEventListener: noop, appendChild: c => c, remove: noop, setAttribute: noop, querySelector: () => makeEl(),
    getContext: () => makeCtx(), width: 0, height: 0 };
  return el;
}
exports.load = function (path, search = '', expose = '') {
  const src = fs.readFileSync(path, 'utf8').split('<script>')[1].split('</script>')[0];
  const els = {};
  global.document = { getElementById: id => els[id] || (els[id] = makeEl()), createElement: () => makeEl(), body: makeEl(), documentElement: makeEl(),
    querySelector: () => makeEl(), querySelectorAll: () => [] };
  global.window = { devicePixelRatio: 1 }; global.navigator = {}; global.location = { protocol: 'file:', search };
  global.localStorage = { setItem: noop, getItem: () => null };
  global.innerWidth = 1200; global.innerHeight = 800;
  const L = {}; global.addEventListener = (n, f) => (L[n] = L[n] || []).push(f);
  let cb = null; global.requestAnimationFrame = f => cb = f;
  let now = 0; global.performance = { now: () => now }; global.setTimeout = f => f();
  const api = new Function(src + ';return {' + expose + '};')();
  const fr = n => { for (let i = 0; i < n; i++) { now += 16.67; cb(now); } };
  const key = (t, c) => (L[t] || []).forEach(f => f({ code: c, repeat: false, preventDefault: noop, timeStamp: now }));
  return { api, fr, key, els };
};
