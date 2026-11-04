// node render2.js cfg.json out.mp4 [preview times]
const { chromium } = require('playwright'); const { spawn } = require('child_process');
const fs = require('fs'); const path = require('path');
(async () => {
  const [,, cfgF, out, preview] = process.argv; const fps = 25;
  const cfg = JSON.parse(fs.readFileSync(cfgF, 'utf8')); const H = cfg.format === '16:9';
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: H ? { width: 1920, height: 1080 } : { width: 1080, height: 1920 } });
  await p.addInitScript(c => { window.REEL = c; }, cfg);
  await p.goto('file://' + path.resolve(__dirname, 'motion.html')); await p.evaluate(() => document.fonts.ready);
  const total = await p.evaluate(() => window.TOTAL); const voice = await p.evaluate(() => window.VOICE);
  fs.writeFileSync(out.replace('.mp4', '.voice.txt'), voice);
  console.log('total', total.toFixed(1), 's; voice chars', voice.length, 'words', voice.split(' ').length);
  if (preview) { for (const t of preview.split(',').map(Number)) { await p.evaluate(t => setT(t), t); await p.screenshot({ path: out.replace('.mp4', `_${t}.png`) }); } await b.close(); return; }
  const ff = spawn('ffmpeg', ['-v','error','-y','-f','image2pipe','-framerate',String(fps),'-i','-','-c:v','libx264','-preset','veryfast','-crf','21','-pix_fmt','yuv420p','-movflags','+faststart',out]);
  const n = Math.ceil(total * fps);
  for (let i = 0; i < n; i++) { await p.evaluate(t => setT(t), i / fps); const buf = await p.screenshot({ type: 'jpeg', quality: 90 }); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await b.close(); console.log('done', out);
})();
