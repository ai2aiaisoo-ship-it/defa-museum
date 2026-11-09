#!/bin/bash
S=/tmp/render/shots
echo "=== 1) atlas: webgl + maplibre + error text ==="
agent-browser open "http://localhost:3000/#atlas" >/dev/null 2>&1; sleep 3.5
agent-browser eval "(()=>{const c=document.createElement('canvas');const gl=c.getContext('webgl2')||c.getContext('webgl');return JSON.stringify({webgl:!!gl,version:gl?gl.getParameter(gl.VERSION):null,hasMaplibreLib:typeof window.maplibregl,mainText:(document.querySelector('main').innerText||'').slice(0,400)})})()" 2>/dev/null
agent-browser screenshot $S/atlas2.png >/dev/null 2>&1
echo "--- maplibre in dev.log:"; grep -iE "maplibre|webgl|map" dev.log | tail -5

echo "=== 2) atlas: how is map implemented? ==="
rg -n "maplibre|MapLibre|new maplibregl|Leaflet|leaflet" src/components/museum/MapAtlas.tsx | head -8

echo "=== 3) map-quiz screenshot ==="
agent-browser open "http://localhost:3000/#map-quiz" >/dev/null 2>&1; sleep 3
agent-browser eval "(()=>{const svg=[...document.querySelectorAll('main svg')].length;const circles=[...document.querySelectorAll('main svg circle')].length;return JSON.stringify({svg,circles,btns:[...document.querySelectorAll('main button')].map(b=>b.textContent.trim().slice(0,15)).slice(0,9)})})()" 2>/dev/null
agent-browser screenshot $S/map-quiz.png >/dev/null 2>&1

echo "=== 4) assistant answer check ==="
agent-browser open "http://localhost:3000/#assistant" >/dev/null 2>&1; sleep 2
agent-browser eval "(()=>{const inp=[...document.querySelectorAll('main input,main textarea')].find(i=>i.offsetParent);const st=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;st.call(inp,'عملیات فکه چه نتیجه‌ای داشت؟');inp.dispatchEvent(new Event('input',{bubbles:true}));const btn=[...document.querySelectorAll('main button')].find(b=>/ارسال/.test(b.textContent||''));btn.click();return 'sent'})()" 2>/dev/null
sleep 5
agent-browser eval "(()=>{const bubbles=[...document.querySelectorAll('main [class*=bubble],main [class*=rounded]')].map(e=>e.textContent.trim()).filter(t=>t.length>40&&t.length<500);return JSON.stringify({n:bubbles.length,ans:bubbles.filter(t=>/فکه|جزیره|مجنون/.test(t)).slice(0,2)})})()" 2>/dev/null

echo "=== 5) crops: ticker / flag / player ==="
python3 - <<'EOF'
from PIL import Image
h=Image.open('/tmp/render/shots/home.png')
W,H=h.size
# ticker strip top
h.crop((0,0,W,30)).resize((W*2,60)).save('/tmp/render/shots/crop-ticker.png')
# music player bottom-left
h.crop((0,H-90,320,H)).resize((640,180)).save('/tmp/render/shots/crop-player.png')
# flag bottom-right
h.crop((W-160,H-110,W,H)).resize((480,330)).save('/tmp/render/shots/crop-flag.png')
print('crops done', h.size)
EOF

echo "=== 6) remaining view screenshots refresh (gallery, admin, archive, timeline, stats, battle-maps, operations, experiences already have) ==="
for v in gallery admin archive; do agent-browser open "http://localhost:3000/#$v" >/dev/null 2>&1; sleep 2; agent-browser screenshot /tmp/render/shots/$v.png >/dev/null 2>&1; done
echo done
