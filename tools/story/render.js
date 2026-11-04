// Story-style reel renderer: HTML (window.frame(t), TOTAL, SFX) -> mp4 with sound effects.
// Usage: node render.js story.html out.mp4 [--subs=0] [--preview=1.0,5.2]
// Writes: out.mp4 (video + SFX), out.silent.mp4 (video only), out.sfx.mp3 (SFX bed only, for musicUrl)
const {chromium}=require('playwright');const {spawn,execFileSync}=require('child_process');const path=require('path');const fs=require('fs');
const args=process.argv.slice(2);const html=path.resolve(args[0]);const out=path.resolve(args[1]);
const opt=Object.fromEntries(args.slice(2).map(a=>a.replace(/^--/,'').split('=')));
const SFXDIR=path.join(__dirname,'..','sfx');const base=out.replace(/\.mp4$/,'');
(async()=>{
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:540,height:960},deviceScaleFactor:2});
 await p.goto('file://'+html+(opt.subs==='0'?'?subs=0':''));await p.evaluate(()=>document.fonts.ready);
 const {total,sfx}=await p.evaluate(()=>({total:TOTAL,sfx:window.SFX||[]}));
 if(opt.preview){for(const t of opt.preview.split(',').map(Number)){await p.evaluate(t=>frame(t),t);await p.screenshot({path:`${base}.preview_${t}.jpg`,type:'jpeg',quality:85});}await b.close();console.log('previews written');return;}
 const n=Math.round(total*30);const silent=base+'.silent.tmp.mp4';
 const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','18','-pix_fmt','yuv420p',silent],{stdio:['pipe','inherit','inherit']});
 for(let i=0;i<n;i++){await p.evaluate(t=>frame(t),i/30);const buf=await p.screenshot({type:'jpeg',quality:92});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));}
 ff.stdin.end();const code=await new Promise(r=>ff.on('close',r));await b.close();if(code!==0)throw new Error('ffmpeg video failed');
 fs.renameSync(silent,base+'.silent.mp4');
 // SFX bed
 const ins=[],fl=[];sfx.forEach((c,i)=>{const f=path.join(SFXDIR,c.name+'.wav');if(!fs.existsSync(f)){console.warn('missing sfx',c.name);return;}
  if(c.dur)ins.push('-stream_loop','-1');ins.push('-i',f);const k=ins.filter(x=>x==='-i').length-1;
  fl.push(`[${k}:a]${c.dur?`atrim=0:${c.dur},afade=t=out:st=${Math.max(0,c.dur-0.4)}:d=0.4,`:''}volume=${c.vol??0.6},adelay=${Math.round(c.t*1000)}:all=1[a${k}]`);});
 const cnt=ins.filter(x=>x==='-i').length;
 const filter=fl.join(';')+';'+Array.from({length:cnt},(_,k)=>`[a${k}]`).join('')+`amix=inputs=${cnt}:normalize=0:duration=longest,atrim=0:${total},alimiter=limit=0.9[mix]`;
 execFileSync('ffmpeg',['-v','error','-y',...ins,'-filter_complex',filter,'-map','[mix]','-ac','2','-ar','44100','-c:a','libmp3lame','-b:a','192k',base+'.sfx.mp3']);
 execFileSync('ffmpeg',['-v','error','-y','-i',base+'.silent.mp4','-i',base+'.sfx.mp3','-map','0:v','-map','1:a','-c:v','copy','-c:a','aac','-b:a','192k','-shortest',base+'.tmp.mp4']);
 fs.renameSync(base+'.tmp.mp4',out);console.log('done',out,total.toFixed(1)+'s');
})();
