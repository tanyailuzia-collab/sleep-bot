# BUKVITSA motion engine

Motion-design videos (reels 9:16 and YouTube 16:9) in the BUKVITSA palette, rendered locally, then voiced in ChatPlace.

Setup (in an empty working dir):
  cp tools/motion.html tools/render2.js .
  npm i @fontsource/roboto@5.1.0      # fonts, loaded from node_modules
  node render2.js scenes.json out.mp4 [2,10,20]   # optional preview frames

scenes.json: {"format":"9:16"|"16:9","tag","handle","wps":2.6,"scenes":[...]}
Scene types: hook{badge,big,title,sub}, chapter{badge,title}, point{n,title,body}, statement{title,sub,big}, cta{title,button}.
Icons: clock, crib, roly, nope, wave, spark, bars, diary, moon, heart, ring. Each scene has "voice" (narration); its duration = words/wps + 0.7 s.
render2.js writes out.voice.txt = full narration text.

Voicing: split the mp4 into parts of <=30 s, push to branch `media` (folder YYYY-MM/), then
virale_multi_video_generate with parts[{clipUrl: raw.githubusercontent.com/... , duration}], voiceover{text, language, voiceId:"Alice"}, subtitles true, music true.
Cost: ~$0.30 per reel, ~$1 per YouTube video.
