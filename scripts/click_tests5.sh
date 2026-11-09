#!/bin/bash
S=/tmp/render/shots
echo "=== 1) review state: reload persistence ==="
agent-browser open "http://localhost:3000/#memories" >/dev/null 2>&1; sleep 2
agent-browser eval "(()=>{const n=[...document.querySelectorAll('main *')].filter(e=>e.children.length===0&&/تأیید کارشناسی —/.test(e.textContent||'')).length;return 'named-reviews-after-reload:'+n})()" 2>/dev/null
grep -rn "useState\|persist" src/components/museum/MartyrsMemoriesView.tsx | grep -iE "review|kar" | head -4

echo "=== 2) narration play wiring (prototype patch) ==="
agent-browser open "http://localhost:3000/#experiences" >/dev/null 2>&1; sleep 2
agent-browser eval "(()=>{window.__calls=[];const orig=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){window.__calls.push('play:'+this.src.slice(-30));return orig.call(this).catch(e=>window.__calls.push('rejected:'+e.name))};const b=[...document.querySelectorAll('main button[aria-label*=پخش]')][0];if(!b)return 'no btn';b.click();return new Promise(r=>setTimeout(()=>{HTMLMediaElement.prototype.play=orig;r(JSON.stringify(window.__calls))},2500))})()" 2>/dev/null

echo "=== 3) atlas deep inspect ==="
agent-browser open "http://localhost:3000/#atlas" >/dev/null 2>&1; sleep 3
agent-browser eval "(()=>{const cv=document.querySelector('canvas.maplibregl-canvas,canvas');const cont=document.querySelector('.maplibregl-map,.leaflet-container,[class*=map]');return JSON.stringify({canvas:!!cv,cw:cv&&cv.width,ch:cv&&cv.height,container:cont?String(cont.className).slice(0,50):'none',text:(document.querySelector('main')||{}).innerText?.slice(0,120)})})()" 2>/dev/null

echo "=== 4) admin panel ==="
agent-browser open "http://localhost:3000/#admin" >/dev/null 2>&1; sleep 2
agent-browser eval "(()=>{const m=document.querySelector('main');const bs=[...m.querySelectorAll('button')].slice(0,8).map(b=>b.textContent.trim().slice(0,25));return JSON.stringify({len:m.innerText.length,btns:bs})})()" 2>/dev/null

echo "=== 5) assistant chat ==="
agent-browser open "http://localhost:3000/#assistant" >/dev/null 2>&1; sleep 2
agent-browser eval "(()=>{const inp=[...document.querySelectorAll('main input,main textarea')].find(i=>i.offsetParent);if(!inp)return 'no input';const st=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;st.call(inp,'فکه چه بود؟');inp.dispatchEvent(new Event('input',{bubbles:true}));const form=inp.closest('form');const btn=[...document.querySelectorAll('main button')].find(b=>/ارسال|بپرس/.test(b.textContent||''));if(btn)btn.click();else if(form)form.requestSubmit();return 'asked'})()" 2>/dev/null
sleep 4
agent-browser eval "(()=>{const m=document.querySelector('main');return JSON.stringify({len:m.innerText.length,tail:m.innerText.slice(-200)})})()" 2>/dev/null

echo "=== 6) UGC اشتراک خاطره dialog ==="
agent-browser open "http://localhost:3000/#memories" >/dev/null 2>&1; sleep 2
agent-browser eval "(()=>{const b=[...document.querySelectorAll('main button')].find(x=>/اشتراک خاطره|اشتراکِ خاطره/.test(x.textContent||''));if(!b)return 'no-ugc-btn:'+ [...document.querySelectorAll('main button')].filter(x=>/خاطره/.test(x.textContent||'')).length;b.click();return 'clicked:'+b.textContent.trim().slice(0,40)})()" 2>/dev/null
sleep 1.2
agent-browser eval "(()=>{const d=document.querySelector('[role=dialog]');if(!d)return 'no dialog';return 'DIALOG:'+d.innerText.slice(0,150)})()" 2>/dev/null
agent-browser press Escape 2>/dev/null

echo "=== 7) ffprobe audio integrity ==="
which ffprobe >/dev/null && for f in public/audio/defa-ambient.wav public/audio/narrations/exp-cmd-samen.mp3 public/audio/narrations/exp-opsec-karbala4.mp3; do echo "-- $f"; ffprobe -v error -show_entries format=duration,format_name -of default=nw=1 "$f" 2>&1 | head -3; done || echo "no ffprobe"

echo "=== 8) map-quiz & mek-ops & documentaries text ==="
for v in map-quiz mek-ops documentaries; do agent-browser open "http://localhost:3000/#$v" >/dev/null 2>&1; sleep 2; agent-browser eval "(()=>{const m=document.querySelector('main');return '$v >>> '+m.innerText.slice(0,180).replace(/\n/g,' | ')})()" 2>/dev/null; done
