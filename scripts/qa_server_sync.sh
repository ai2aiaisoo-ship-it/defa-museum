#!/bin/bash
S=/tmp/render/qa3
mkdir -p $S
echo '{"updatedAt":"1970-01-01T00:00:00.000Z","reviews":[]}' > /home/z/my-project/db/mazar-reviews.json

echo "=== 1) E2E named review -> server ==="
agent-browser open "http://localhost:3000/#memories" >/dev/null 2>&1; sleep 3
agent-browser eval "(()=>{const b=[...document.querySelectorAll('main button')].find(x=>/ثبت مرور نام‌دار/.test(x.textContent||''));if(!b)return 'no-btn';b.click();return 'opened'})()" 2>/dev/null
sleep 1.2
agent-browser eval "(()=>{const inputs=[...document.querySelectorAll('[role=dialog] input,[role=dialog] textarea')];const nameI=inputs.find(i=>/کارشناس/.test(i.placeholder||''));if(nameI){const st=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;st.call(nameI,'کارشناس آرشیو بنیاد شهید');nameI.dispatchEvent(new Event('input',{bubbles:true}))}const cb=[...document.querySelectorAll('[role=dialog] input[type=checkbox]')];cb.forEach(c=>{if(!c.checked)c.click()});return 'ok cb='+cb.length})()" 2>/dev/null
agent-browser eval "(()=>{const btn=[...document.querySelectorAll('[role=dialog] button')].find(b=>/ثبتِ مرور|ثبت مرور/.test(b.textContent||''));if(btn){btn.click();return 'submitted'}return 'no'})()" 2>/dev/null
sleep 3
curl -s http://localhost:3000/api/reviews --max-time 10 | python3 -c "import json,sys; d=json.load(sys.stdin); rs=d.get('reviews',[]); print('SERVER-REVIEWS:', len(rs)); print('reviewer:', rs[0]['reviewer'] if rs else '—')"

echo "=== 2) reload -> server restore (named review survives localStorage clear) ==="
agent-browser eval "localStorage.clear(); 'ls-cleared'" 2>/dev/null
agent-browser reload >/dev/null 2>&1; sleep 3.5
agent-browser eval "(()=>{const n=[...document.querySelectorAll('main *')].filter(e=>e.children.length===0&&/تأیید کارشناسی —/.test(e.textContent||'')).length;return 'named-reviews-restored-from-server: '+n})()" 2>/dev/null

echo "=== 3) portraits local check ==="
agent-browser eval "(()=>{const imgs=[...document.querySelectorAll('img')];const remote=imgs.filter(i=>i.src.includes('z-cdn')).length;const local=imgs.filter(i=>i.src.includes('/images/')).length;const broken=imgs.filter(i=>i.complete&&i.naturalWidth===0).length;return JSON.stringify({remote,local,broken})})()" 2>/dev/null

echo "=== 4) ticker visual + memories + map-quiz + mek screenshots ==="
agent-browser open "http://localhost:3000/#home" >/dev/null 2>&1; sleep 2.5
agent-browser screenshot $S/home.png >/dev/null 2>&1
agent-browser open "http://localhost:3000/#memories" >/dev/null 2>&1; sleep 3
agent-browser screenshot $S/memories.png >/dev/null 2>&1
agent-browser open "http://localhost:3000/#map-quiz" >/dev/null 2>&1; sleep 3
agent-browser screenshot $S/map-quiz.png >/dev/null 2>&1
agent-browser open "http://localhost:3000/#mek-ops" >/dev/null 2>&1; sleep 2.5
agent-browser screenshot $S/mek-ops.png >/dev/null 2>&1
python3 - <<'EOF'
from PIL import Image
files=['home','memories','map-quiz','mek-ops']
imgs=[Image.open(f'/tmp/render/qa3/{f}.png').resize((760,428)) for f in files]
c=Image.new('RGB',(1530,866),(10,10,10))
c.paste(imgs[0],(0,0)); c.paste(imgs[1],(770,0)); c.paste(imgs[2],(0,438)); c.paste(imgs[3],(770,438))
c.save('/tmp/render/qa3/comp-final.png'); print('ok')
EOF

echo "=== 5) console clean? ==="
agent-browser console 2>/dev/null | grep -iE "error|warn" | head -5; agent-browser errors 2>/dev/null | head -5
echo "(empty = clean)"
echo "=== 6) quick full sweep: any broken imgs or remote z-cdn across key views ==="
for v in home gallery archive martyrs commanders avini; do
  agent-browser open "http://localhost:3000/#$v" >/dev/null 2>&1; sleep 1.8
  R=$(agent-browser eval "(()=>{const imgs=[...document.querySelectorAll('img')];return 'broken:'+imgs.filter(i=>i.complete&&i.naturalWidth===0).length+' remote:'+imgs.filter(i=>i.src.includes('z-cdn')).length+' total:'+imgs.length})()" 2>/dev/null | tr -d '"')
  echo "$v $R"
done
