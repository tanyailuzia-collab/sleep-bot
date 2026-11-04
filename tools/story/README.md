# Story reels — «Гіпотетичний сценарій» style (approved 04.11.2026)

Dark flat-2D motion style like the TikTok channel «72 Години»: dark warm background (#1b1310 → #3a2214),
orange city/windows (#e8892c / #f2a33a), red #ec3b2e and yellow #f7b500 accents, Roboto Condensed 800/900,
big two-line headline at the top, small rounded badges («⚠ ГІПОТЕТИЧНИЙ СЦЕНАРІЙ», «КОРТИЗОЛ ↑», «21:00»),
word-pop subtitles in the middle (key words red/yellow), a new scene every 2.5–4 s, slow zoom, floating embers,
quick zoom-crossfade between scenes, final card «ЧАСТИНА 2 — …? / ПІДПИШИСЬ» + handle.
Used for BOTH brands: UA (@tanyadonchenko_proson, Ukrainian text) and EN (@donchenkode, English text, am/pm and «13h 53m» rules).

## Files
- story.html — template + scene library (night city, spinning clock, blueprint child body with glowing brain,
  shocked/tired mom character, running toddler silhouette, night house with blinking window + time badges, end card).
  Helpers: bgGrad, embers, building, badge, bigText, subs/Wd, mom(), vignette, handle.
- render.js — renders frames with Playwright and mixes sound effects from window.SFX.
- ../sfx/*.wav — synthesized sound library: tick, tock, clock_ticking (loop), clock_fast, click, pop, whoosh, whoosh_long,
  boom, heartbeat, crickets (loop), riser, ding, switch (light switch), alarm, drone (dark ambient bed), wind.

## Making a new reel
1. Copy story.html to a work dir (with the .woff2 fonts) and rewrite the scene functions/texts for the new script.
   Reuse the library pieces; draw new simple flat objects in SVG the same way (flat shapes, warm dark palette, no gradients except bg).
   Keep one recurring character (mom or child) across scenes; change only expression.
2. Edit the REEL CONFIG block: SCENES = [[fn, seconds], ...] (7–10 scenes, 2.5–4 s each, total 25–55 s);
   duration of each scene ≈ its narration words / 2.3 + 0.4 s.
3. window.SFX cues: a whoosh at every scene change (−0.15 s), pop on every badge, drone bed for the whole reel,
   plus one meaningful sound per scene (clock → clock_fast/clock_ticking, night → crickets, light on → switch,
   wake-up → alarm, stress/body → heartbeat, tension before the twist → riser, reveal → boom, idea → ding).
   Keep vol: drone .2, ambience .2–.45, effects .4–.7.
4. `node render.js story.html out.mp4 --preview=1,5,9` → look at frames (text must not touch the edges).
5. `node render.js story.html out.mp4 --subs=0` → out.mp4 (video+SFX), out.silent.mp4, out.sfx.mp3.
   Use --subs=0 when ChatPlace burns subtitles; without the flag our own word-pop subtitles are drawn.

## Voice, sounds, subtitles (approved 04.11.2026 — test variant B)
- Render with --subs=0, cut out.silent.mp4 into parts (integer seconds, <=30 s each), push parts + out.sfx.mp3 to branch media.
- virale_multi_video_generate: parts = silent clips, music true + musicUrl = raw URL of out.sfx.mp3 (our SFX bed),
  subtitles true, subtitleStyle "bold_impact", subtitleLanguage uk/en,
  voiceover {text, voiceId "Alice", language "uk"|"en", stability 0.3, style 0.7}.
- Intonation ONLY through punctuation: "..." = pause / whisper / slow, "!" and CAPS = loud, short choppy sentences = fast,
  one paragraph per scene. Do NOT use bracket tags like [whispers].
- Approved sample: 2026-11/story-test (ChatPlace task 01a1a862-7b55-731a-8151-0349d92f19e3).
