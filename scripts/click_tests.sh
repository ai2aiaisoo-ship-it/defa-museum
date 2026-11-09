#!/bin/bash
# Interactive click-tests with evidence capture
S=/tmp/render/shots
echo "=== 1) MARTYRS: find Chamran/Hemmat/Bakri cards ==="
agent-browser open "http://localhost:3000/#martyrs" >/dev/null 2>&1; sleep 2
agent-browser eval "(()=>{const t=[...document.querySelectorAll('main *')].filter(e=>e.children.length===0 && /چمران|همت|باکری/.test(e.textContent||''));return t.slice(0,8).map(e=>e.tagName+':'+(e.textContent||'').slice(0,40)).join(' | ')})()" 2>/dev/null

echo "=== 2) scroll to Chamran card & shot ==="
agent-browser find text "مصطفی چمران" scrollintoview 2>/dev/null || agent-browser eval "window.scrollTo(0,document.body.scrollHeight*0.6)" >/dev/null 2>&1
sleep 1.2
agent-browser screenshot $S/martyrs-scrolled.png >/dev/null 2>&1

echo "=== 3) MEMORIES: grave photos + reviewer button ==="
agent-browser open "http://localhost:3000/#memories" >/dev/null 2>&1; sleep 2
agent-browser eval "(()=>{const b=[...document.querySelectorAll('main button')];const rev=b.filter(x=>/مرور|🧑/.test((x.getAttribute('aria-label')||'')+(x.title||'')+x.textContent));const pend=[...document.querySelectorAll('main *')].filter(e=>e.children.length===0 && /در انتظار مرور/.test(e.textContent||'')).length;const ack=[...document.querySelectorAll('main *')].filter(e=>e.children.length===0 && /تأیید|تایید/.test(e.textContent||'')).length;return JSON.stringify({reviewBtns:rev.length,pendingLabels:pend,confirmedLabels:ack,totalBtns:b.length})})()" 2>/dev/null

echo "=== 4) count mazar images section, scroll, shot ==="
agent-browser eval "(()=>{const h=[...document.querySelectorAll('main h2,h3,div')].find(e=>/تصاویر مزار|مزار/.test(e.textContent||'')&&e.offsetHeight>0&&e.offsetHeight<80);if(h)h.scrollIntoView({block:'start'});return 'ok'})()" 2>/dev/null
sleep 1
agent-browser screenshot $S/memories-mazar.png >/dev/null 2>&1

echo "=== 5) click first reviewer button (state before/after) ==="
BEFORE=$(agent-browser eval "(()=>{const els=[...document.querySelectorAll('main *')].filter(e=>e.children.length===0&&/در انتظار مرور/.test(e.textContent||''));return els.length})()" 2>/dev/null)
agent-browser eval "(()=>{const b=[...document.querySelectorAll('main button')].find(x=>/🧑|مرور/.test(x.textContent||''));if(b){b.click();return 'clicked:'+b.textContent.slice(0,30)}return 'no-btn'})()" 2>/dev/null
sleep 1.5
agent-browser screenshot $S/reviewer-click.png >/dev/null 2>&1
AFTER=$(agent-browser eval "(()=>{const els=[...document.querySelectorAll('main *')].filter(e=>e.children.length===0&&/در انتظار مرور/.test(e.textContent||''));return els.length})()" 2>/dev/null)
echo "pending before=$BEFORE after=$AFTER"

echo "=== 6) MUSIC: khak-e-sorkh player ==="
agent-browser open "http://localhost:3000/#home" >/dev/null 2>&1; sleep 2
agent-browser eval "(()=>{const a=[...document.querySelectorAll('audio')].map(x=>({src:x.currentSrc||x.src,paused:x.paused,volume:x.volume,loop:x.loop}));const btns=[...document.querySelectorAll('button')].filter(b=>/پخش|خاک|مداوم|موسیقی/.test(b.textContent||'')).map(b=>b.textContent.trim().slice(0,25));return JSON.stringify({audios:a,btns:btns.slice(0,6)})})()" 2>/dev/null
