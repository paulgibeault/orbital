// Drive headless Chrome over the DevTools protocol: press keys, then screenshot.
const [,, url, out, script] = process.argv;
const { spawn } = require('child_process'); const fs = require('fs');
const ch = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--disable-gpu', '--user-data-dir=/tmp/oc-chrome2',
  '--remote-debugging-port=9333', '--window-size=1600,1000', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  let ws; for (let i = 0; i < 40 && !ws; i++) { await sleep(250); try { const l = await (await fetch('http://127.0.0.1:9333/json/list')).json(); const pg = l.find(x => x.type === 'page'); if (pg) ws = pg.webSocketDebuggerUrl; } catch (e) {} }
  const sock = new WebSocket(ws); await new Promise(r => sock.onopen = r);
  let id = 0; const pending = {}, errors = []; sock.onmessage = m => { const d = JSON.parse(m.data); if (d.id && pending[d.id]) { pending[d.id](d.result); delete pending[d.id]; }
    if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception ? d.params.exceptionDetails.exception.description : d.params.exceptionDetails.text);
    if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errors.push(d.params.args.map(a => a.value || a.description).join(' ')); };
  const send = (method, params = {}) => new Promise(r => { const i = ++id; pending[i] = r; sock.send(JSON.stringify({ id: i, method, params })); });
  await send('Emulation.setDeviceMetricsOverride', { width: 1600, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Page.enable'); await send('Runtime.enable'); await send('Page.navigate', { url }); await sleep(1500);
  const K = { Space: [' ', 32], Enter: ['Enter', 13], Escape: ['Escape', 27], KeyW: ['w', 87], KeyS: ['s', 83], KeyD: ['d', 68], KeyA: ['a', 65], KeyF: ['f', 70], KeyZ: ['z', 90], ArrowRight: ['ArrowRight', 39], ShiftLeft: ['Shift', 16], KeyT: ['t', 84], KeyQ: ['q', 81], KeyN: ['n', 78], KeyB: ['b', 66], KeyR: ['r', 82] };
  const key = async (type, code) => send('Input.dispatchKeyEvent', { type, code, key: K[code][0], windowsVirtualKeyCode: K[code][1] });
  for (const step of script.split(' ')) {
    const i0 = step.indexOf(':'), a = step.slice(0, i0), b = step.slice(i0 + 1);
    if (a === 'wait') await sleep(+b); else if (a === 'down') await key('keyDown', b); else if (a === 'up') await key('keyUp', b);
    else if (a === 'eval') await send('Runtime.evaluate', { expression: decodeURIComponent(b) });
    else if (a === 'tap') { await key('keyDown', b); await sleep(60); await key('keyUp', b); }
  }
  const shot = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(out, Buffer.from(shot.data, 'base64'));
  console.log(errors.length ? 'JS ERRORS:\n' + errors.join('\n') : 'no JS errors');
  sock.close(); ch.kill(); process.exit(0);
})().catch(e => { console.error(e); ch.kill(); process.exit(1); });
