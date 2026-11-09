#!/bin/bash
S=/tmp/render/shots
echo "=== 1) review persistence mechanism ==="
Rg() { :; }
grep -rn "localStorage" src/components/museum/MartyrsMemoriesView.tsx src/data/grave-reviews.ts 2>/dev/null | head -6
grep -rn "graveReview\|reviewState\|review" src/components/museum/MartyrsMemoriesView.tsx 2>/dev/null | grep -iE "storage|fetch|api|post" | head -6

echo "=== 2) correct-path local audio check ==="
for f in audio/narrations/exp-cmd-samen.mp3 audio/defa-ambient.wav; do curl -s -o /dev/null -w "/$f HTTP:%{http_code} bytes:%{size_download}\n" "http://localhost:3000/$f" --max-time 10 -r 0-2000; done

echo "=== 3) direct audio play test (isolate policy vs app bug) ==="
agent-browser open "http://localhost:3000/#home" >/dev/null 2>&1; sleep 2
agent-browser eval "(()=>{const a=new Audio('https://dl2.mifamusic.ir/Music/1389/03/16/Mohammadreza%20Aligholi%20-%20Khake%20Sorkh/01%20-%20Khak-e-Sorkh.mp3');window.__qa=a;return a.play().then(()=>new Promise(r=>setTimeout(()=>r(JSON.stringify({directPlay:true,paused:a.paused,t:+a.currentTime.toFixed(1),dur:!!a.duration})),3000))).catch(e=>'PLAY-ERR:'+e.name+':'+e.message)})()" 2>/dev/null

echo "=== 4) app player state after button click (deep inspect) ==="
agent-browser eval "(()=>{const a=document.querySelector('audio');if(!a)return 'no audio el';return JSON.stringify({paused:a.paused,readyState:a.readyState,networkState:a.networkState,err:a.error&&a.error.code,src:(a.currentSrc||'').slice(0,80),controls:a.controls,muted:a.muted})})()" 2>/dev/null

echo "=== 5) ticker element via elementFromPoint ==="
agent-browser eval "(()=>{const e=document.elementFromPoint(700,8);if(!e)return 'none';let p=e;const chain=[];for(let i=0;i<4&&p;i++){chain.push(p.tagName+':'+String(p.className).slice(0,60)+':'+(p.textContent||'').slice(0,30));p=p.parentElement}return JSON.stringify(chain)})()" 2>/dev/null

echo "=== 6) narration buttons on experiences (aria-labels) ==="
agent-browser open "http://localhost:3000/#experiences" >/dev/null 2>&1; sleep 2
agent-browser eval "(()=>{const bs=[...document.querySelectorAll('main button')];const withAr=bs.filter(b=>b.getAttribute('aria-label')).map(b=>b.getAttribute('aria-label'));const ico=bs.filter(b=>!b.textContent.trim()&&b.querySelector('svg')).length;const auds=[...document.querySelectorAll('main audio')].length;const playIco=bs.filter(b=>/▶|播放|play/i.test(b.innerHTML)&&b.innerHTML.length<400).length;return JSON.stringify({total:bs.length,withAr:withAr.slice(0,10),iconOnly:ico,audioEls:auds,playIco})})()" 2>/dev/null

echo "=== 7) atlas marker click ==="
agent-browser open "http://localhost:3000/#atlas" >/dev/null 2>&1; sleep 3
agent-browser eval "(()=>{const mk=document.querySelector('.maplibregl-marker,.leaflet-marker-icon,[class*=marker]');if(!mk)return 'no marker el';const r=mk.getBoundingClientRect();return JSON.stringify({cls:String(mk.className).slice(0,60),x:r.x+r.width/2,y:r.y+r.height/2})})()" 2>/dev/null

echo "=== 8) search test ==="
agent-browser open "http://localhost:3000/#search" >/dev/null 2>&1; sleep 1.5
agent-browser eval "(()=>{const inp=document.querySelector('main input');if(!inp)return 'no input';const st=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;st.call(inp,'فکه');inp.dispatchEvent(new Event('input',{bubbles:true}));return 'typed فکه'})()" 2>/dev/null
sleep 1.5
agent-browser eval "(()=>{const m=document.querySelector('main');return JSON.stringify({text:m.innerText.length,hasResults:/فکه/.test(m.innerText),sample:(m.innerText.match(/فکه.{0,60}/)||[''])[0]})})()" 2>/dev/null

echo "=== 9) learn quiz interaction ==="
agent-browser open "http://localhost:3000/#learn" >/dev/null 2>&1; sleep 1.5
agent-browser eval "(()=>{const bs=[...document.querySelectorAll('main button')].filter(b=>/شروع|آزمون|فلش/.test(b.textContent||''));return JSON.stringify(bs.slice(0,5).map(b=>b.textContent.trim().slice(0,30)))})()" 2>/dev/null
