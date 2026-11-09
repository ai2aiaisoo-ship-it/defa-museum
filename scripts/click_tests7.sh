#!/bin/bash
S=/tmp/render/shots
echo "=== 1) legend chip text check ==="
agent-browser open "http://localhost:3000/#atlas" >/dev/null 2>&1; sleep 3
agent-browser eval "(()=>{const chips=[...document.querySelectorAll('main button,main span')].map(e=>e.textContent.trim()).filter(t=>t.length>2&&t.length<20);return JSON.stringify(chips.slice(0,24))})()" 2>/dev/null

echo "=== 2) assistant markdown re-check ==="
agent-browser open "http://localhost:3000/#assistant" >/dev/null 2>&1; sleep 2
agent-browser eval "(()=>{const inp=[...document.querySelectorAll('main input,main textarea')].find(i=>i.offsetParent);const st=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;st.call(inp,'فکه');inp.dispatchEvent(new Event('input',{bubbles:true}));const btn=[...document.querySelectorAll('main button')].find(b=>/ارسال/.test(b.textContent||''));btn.click();return 'sent'})()" 2>/dev/null
sleep 4
agent-browser eval "(()=>{const b=[...document.querySelectorAll('main div,main p')].find(e=>/منابع مرتبط/.test(e.textContent||''));if(!b)return 'no-bubble';const h=b.innerHTML;return JSON.stringify({asterisk:h.includes('*'),strong:h.includes('<strong'),htmlSample:h.slice(0,200)})})()" 2>/dev/null

echo "=== 3) hall-3d scroll-in test ==="
agent-browser open "http://localhost:3000/#hall-3d" >/dev/null 2>&1; sleep 3
agent-browser eval "window.scrollTo(0,1200); 'scrolled'" 2>/dev/null
sleep 2.5
agent-browser screenshot $S/hall-3d-scrolled.png >/dev/null 2>&1
agent-browser eval "(()=>{const t=document.body.innerText;return JSON.stringify({hasOpNames:/والفجر|خیبر|کربلای|فتح/.test(t),progress:(t.match(/پیش‌رفت.{0,12}/)||[''])[0]})})()" 2>/dev/null

echo "=== 4) experiences narration player open ==="
agent-browser open "http://localhost:3000/#experiences" >/dev/null 2>&1; sleep 2
agent-browser eval "(()=>{const b=[...document.querySelectorAll('main button[aria-label*=نمایش کنترل]')][0];if(!b)return 'no';b.click();return 'opened-player'})()" 2>/dev/null
sleep 1.5
agent-browser screenshot $S/experiences-player.png >/dev/null 2>&1
agent-browser eval "(()=>{const m=document.querySelector('main');return (m.innerText.match(/روایت.{0,80}/)||[''])[0]})()" 2>/dev/null

echo "=== 5) build 2x2 composites ==="
python3 - <<'EOF'
from PIL import Image
def grid(files,out,size=(800,450)):
    imgs=[Image.open(f).resize(size) for f in files]
    W=size[0]*2+10; H=size[1]*2+10
    c=Image.new('RGB',(W,H),(10,10,10))
    pos=[(0,0),(size[0]+10,0),(0,size[1]+10),(size[0]+10,size[1]+10)]
    for im,p in zip(imgs,pos): c.paste(im,p)
    c.save(out)
    print('saved',out)
grid(['/tmp/render/shots/experiences.png','/tmp/render/shots/battle-maps.png','/tmp/render/shots/operations.png','/tmp/render/shots/gallery.png'],'/tmp/render/shots/comp-A.png')
grid(['/tmp/render/shots/admin.png','/tmp/render/shots/archive.png','/tmp/render/shots/mek-ops.png','/tmp/render/shots/map-quiz.png'],'/tmp/render/shots/comp-B.png')
grid(['/tmp/render/shots/memories-mazar.png','/tmp/render/shots/timeline.png','/tmp/render/shots/stats.png','/tmp/render/shots/hall-3d-scrolled.png'],'/tmp/render/shots/comp-C.png')
grid(['/tmp/render/shots/khorramshahr.png','/tmp/render/shots/avini.png','/tmp/render/shots/experiences-player.png','/tmp/render/shots/saddam-dossier.png'],'/tmp/render/shots/comp-D.png')
EOF
