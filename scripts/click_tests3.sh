#!/bin/bash
S=/tmp/render/shots
echo "=== 1) khak-e-sorkh URL reachability (LOCKED LINK - read-only check) ==="
curl -sI --max-time 20 "https://dl2.mifamusic.ir/Music/1389/03/16/Mohammadreza%20Aligholi%20-%20Khake%20Sorkh/01%20-%20Khak-e-Sorkh.mp3" | head -8
echo "---"
curl -s -o /dev/null -w "HTTP:%{http_code} size:%{size_download} time:%{time_total}s\n" --max-time 25 -r 0-100000 "https://dl2.mifamusic.ir/Music/1389/03/16/Mohammadreza%20Aligholi%20-%20Khake%20Sorkh/01%20-%20Khak-e-Sorkh.mp3"

echo "=== 2) ticker element HTML ==="
agent-browser open "http://localhost:3000/#home" >/dev/null 2>&1; sleep 2
agent-browser eval "(()=>{const el=[...document.querySelectorAll('*')].find(e=>e.className && String(e.className).includes && String(e.className).includes('animate-marquee'));if(el)return el.outerHTML.slice(0,400);const al=[...document.querySelectorAll('[class*=marquee],[class*=ticker],[class*=animate]')].slice(0,3).map(e=>e.className+' :: '+e.textContent.slice(0,60));return JSON.stringify(al)})()" 2>/dev/null

echo "=== 3) martyr card badges ==="
agent-browser open "http://localhost:3000/#martyrs" >/dev/null 2>&1; sleep 2
agent-browser eval "(()=>{const card=[...document.querySelectorAll('main article,main [class*=card]')].find(c=>/چمران/.test(c.textContent||''));if(!card)return 'no-card';const spans=[...card.querySelectorAll('span')].map(s=>s.textContent.trim()).filter(t=>t&&t.length<40);return JSON.stringify(spans.slice(0,18))})()" 2>/dev/null

echo "=== 4) grave labels status census ==="
agent-browser open "http://localhost:3000/#memories" >/dev/null 2>&1; sleep 2
agent-browser eval "(()=>{const counts={};[...document.querySelectorAll('main *')].forEach(e=>{if(e.children.length===0){const t=(e.textContent||'').trim();if(/تأیید کارشناسی|در انتظار مرور|عدم تایید|تصویر رسمی|نیازمند بررسی|خارج از نمایش/.test(t)){const key=t.slice(0,50);counts[key]=(counts[key]||0)+1}}});const exact=[...document.querySelectorAll('main *')].filter(e=>e.children.length===0&&/در انتظار مرور/.test(e.textContent||'')).map(e=>e.textContent.trim().slice(0,80));return JSON.stringify({counts,exact})})()" 2>/dev/null

echo "=== 5) flag click play ==="
agent-browser open "http://localhost:3000/#home" >/dev/null 2>&1; sleep 2
agent-browser eval "(()=>{const b=[...document.querySelectorAll('button,[role=button]')].find(x=>/پرچم ایران/.test((x.getAttribute('aria-label')||'')+(x.title||'')+(x.textContent||'')));if(b){b.click();return 'flag clicked'}return 'no flag btn'})()" 2>/dev/null
sleep 4
agent-browser eval "(()=>{const a=document.querySelector('audio');return a?JSON.stringify({paused:a.paused,currentTime:+a.currentTime.toFixed(2),duration:a.duration?'has-dur':'no-dur'}):'no-audio'})()" 2>/dev/null

echo "=== 6) narration in experiences ==="
agent-browser open "http://localhost:3000/#experiences" >/dev/null 2>&1; sleep 2
agent-browser eval "(()=>{const btns=[...document.querySelectorAll('main button')].filter(b=>/گوش|پخش|روایت/.test(b.textContent||''));return JSON.stringify(btns.slice(0,6).map(b=>b.textContent.trim().slice(0,30)))})()" 2>/dev/null

echo "=== 7) local audio files inventory ==="
ls -la public/audio/narrations/ | head -8; echo "..."; du -sh public/audio/narrations public/audio/defa-ambient.wav 2>/dev/null; ls public/audio/narrations | wc -l
for f in public/audio/narrations/exp-cmd-samen.mp3 public/audio/defa-ambient.wav; do curl -s -o /dev/null -w "$f HTTP:%{http_code}\n" "http://localhost:3000/$f" --max-time 10; done
