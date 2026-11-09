#!/bin/bash
# QA نهایی پس از اصلاحات
S=/tmp/render/qa2
mkdir -p $S
echo "=== 0) server alive ==="
curl -s -o /dev/null -w "home:%{http_code}\n" http://localhost:3000 --max-time 10

echo "=== 1) memories: local mazar images + honest labels ==="
agent-browser open "http://localhost:3000/#memories" >/dev/null 2>&1; sleep 3
agent-browser eval "(()=>{const imgs=[...document.querySelectorAll('main img')].filter(i=>i.src.includes('/images/mazar/'));const broken=imgs.filter(i=>i.complete&&i.naturalWidth===0).length;const remote=[...document.querySelectorAll('main img')].filter(i=>i.src.includes('z-cdn')).length;const chips=[...document.querySelectorAll('main span')].filter(e=>/سنگ مزار|یادمان \\/ یادبود|تصویر زمینه/.test(e.textContent)&&e.textContent.length<20).length;return JSON.stringify({localMazar:imgs.length,broken,remoteRemaining:remote,kindChips:chips})})()" 2>/dev/null
agent-browser screenshot $S/memories.png >/dev/null 2>&1

echo "=== 2) ticker height check ==="
agent-browser eval "(()=>{const h=document.querySelector('.defa-headband');const s=h?.querySelector('.defa-headband-scroll');if(!h||!s)return 'nf';return JSON.stringify({stripH:h.clientHeight,textH:s.getBoundingClientRect().height,clipped:s.getBoundingClientRect().height>h.clientHeight})})()" 2>/dev/null

echo "=== 3) map-quiz with real map ==="
agent-browser open "http://localhost:3000/#map-quiz" >/dev/null 2>&1; sleep 3
agent-browser eval "(()=>{const svg=document.querySelector('main svg');const paths=svg?svg.querySelectorAll('path').length:0;const circles=svg?svg.querySelectorAll('circle').length:0;const text=svg?svg.textContent.includes('ایران'):false;return JSON.stringify({paths,circles,hasIranLabel:text,score:[...document.querySelectorAll('main span')].some(e=>/نمره/.test(e.textContent))})})()" 2>/dev/null
agent-browser screenshot $S/map-quiz.png >/dev/null 2>&1

echo "=== 4) mek-ops enriched ==="
agent-browser open "http://localhost:3000/#mek-ops" >/dev/null 2>&1; sleep 2.5
agent-browser eval "(()=>{const m=document.querySelector('main');return JSON.stringify({len:m.innerText.length,hasTimeline:/خط زمانی مستند/.test(m.innerText),has1344:/۱۳۴۴/.test(m.innerText),hasStats:/تلفات و اسرا/.test(m.innerText)})})()" 2>/dev/null
agent-browser screenshot $S/mek-ops.png >/dev/null 2>&1

echo "=== 5) martyrs chart colors ==="
agent-browser open "http://localhost:3000/#martyrs" >/dev/null 2>&1; sleep 2.5
agent-browser eval "(()=>{const bars=[...document.querySelectorAll('main div')].filter(d=>d.className.includes('bg-gradient-to-t')&&d.className.includes('amber'));return JSON.stringify({brandBars:bars.length})})()" 2>/dev/null

echo "=== 6) review server sync E2E ==="
agent-browser open "http://localhost:3000/#memories" >/dev/null 2>&1; sleep 3
agent-browser eval "(()=>{const b=[...document.querySelectorAll('main button')].find(x=>/کارتابل/.test(x.textContent||''));if(b){b.click();return 'docket-opened'}return 'no'})()" 2>/dev/null
sleep 1
agent-browser eval "(()=>{const inputs=[...document.querySelectorAll('[role=dialog] input,[role=dialog] textarea')];const nameI=inputs.find(i=>/کارشناس/.test(i.placeholder||''));if(nameI){const st=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;st.call(nameI,'کارشناس پشتیبان سرور');nameI.dispatchEvent(new Event('input',{bubbles:true}))}const cb=[...document.querySelectorAll('[role=dialog] input[type=checkbox]')];cb.forEach(c=>{if(!c.checked)c.click()});return 'filled '+inputs.length+' cb='+cb.length})()" 2>/dev/null
agent-browser eval "(()=>{const btn=[...document.querySelectorAll('[role=dialog] button')].find(b=>/ثبتِ مرور|ثبت مرور/.test(b.textContent||''));if(btn){btn.click();return 'submitted'}return 'no'})()" 2>/dev/null
sleep 2.5
curl -s http://localhost:3000/api/reviews --max-time 10 | python3 -c "import json,sys; d=json.load(sys.stdin); print('server-reviews:', d['count'] if 'count' in d else len(d.get('reviews',[])), '| sample reviewer:', (d.get('reviews') or [{}])[0].get('reviewer','—'))"

echo "=== 7) assistant markdown + dates ==="
agent-browser open "http://localhost:3000/#assistant" >/dev/null 2>&1; sleep 2.5
agent-browser eval "(()=>{const inp=[...document.querySelectorAll('main input,main textarea')].find(i=>i.offsetParent);if(!inp)return 'no-input';const st=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;st.call(inp,'عملیات فکه چه نتیجه‌ای داشت؟');inp.dispatchEvent(new Event('input',{bubbles:true}));const btn=[...document.querySelectorAll('main button')].find(b=>/ارسال/.test(b.textContent||''));if(!btn)return 'no-btn';btn.click();return 'sent'})()" 2>/dev/null
sleep 9
agent-browser eval "(()=>{const m=document.querySelector('main');const t=m.innerText;return JSON.stringify({rawAsterisks:t.includes('**'),hasFarvardin:/فروردین/.test(t),hasBahman:/بهمن/.test(t),boldEls:m.querySelectorAll('strong').length})})()" 2>/dev/null

echo "=== 8) console errors sweep ==="
agent-browser errors 2>/dev/null | head -10
agent-browser console 2>/dev/null | grep -iE "error|warn" | head -10
echo "(empty = clean)"

echo "=== 9) full-view broken-image sweep ==="
for v in home hall-3d atlas timeline operations battle-maps experiences stats martyrs memories avini archive khorramshahr mersad war-of-cities tanker-war air-war naval-war iraq-ops mek-ops commanders forces equipment foreign resolutions gallery documentaries sources glossary assistant learn map-quiz search admin docs; do
  agent-browser open "http://localhost:3000/#$v" >/dev/null 2>&1
  sleep 1.6
  R=$(agent-browser eval "(()=>{const imgs=[...document.querySelectorAll('img')];return imgs.filter(i=>i.complete&&i.naturalWidth===0).length+':'+imgs.length})()" 2>/dev/null | tr -d '"')
  echo "$v broken:$R"
done
