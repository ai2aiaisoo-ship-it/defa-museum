#!/bin/bash
S=/tmp/render/qa2
echo "=== 1) who are the 21 remaining z-cdn images? ==="
agent-browser open "http://localhost:3000/#memories" >/dev/null 2>&1; sleep 3
agent-browser eval "(()=>{const remote=[...document.querySelectorAll('main img')].filter(i=>i.src.includes('z-cdn'));const hosts={};remote.forEach(i=>{const u=new URL(i.src);hosts[u.pathname.split('/').pop()]=hosts[u.pathname.split('/').pop()]||{alt:(i.alt||'').slice(0,30),n:0};hosts[u.pathname.split('/').pop()].n++});return JSON.stringify({count:remote.length,files:Object.entries(hosts).slice(0,12).map(([k,v])=>k+' x'+v.n)})})()" 2>/dev/null

echo "=== 2) docket click (correct regex) + server sync ==="
agent-browser eval "(()=>{const b=[...document.querySelectorAll('main button')].find(x=>/ثبت مرور نام‌دار/.test(x.textContent||''));if(b){b.click();return 'opened'}return 'no-btn: '+[...document.querySelectorAll('main button')].slice(0,6).map(x=>x.textContent.trim().slice(0,20)).join(' / ')})()" 2>/dev/null
sleep 1.2
agent-browser eval "(()=>{const inputs=[...document.querySelectorAll('[role=dialog] input,[role=dialog] textarea')];const nameI=inputs.find(i=>/کارشناس/.test(i.placeholder||''));if(nameI){const st=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;st.call(nameI,'کارشناس پشتیبان سرور');nameI.dispatchEvent(new Event('input',{bubbles:true}))}const cb=[...document.querySelectorAll('[role=dialog] input[type=checkbox]')];cb.forEach(c=>{if(!c.checked)c.click()});return 'inputs='+inputs.length+' cb='+cb.length})()" 2>/dev/null
agent-browser eval "(()=>{const btn=[...document.querySelectorAll('[role=dialog] button')].find(b=>/ثبتِ مرور|ثبت مرور/.test(b.textContent||''));if(btn){btn.click();return 'submitted'}return 'no-submit'})()" 2>/dev/null
sleep 2.5
curl -s http://localhost:3000/api/reviews --max-time 10 | python3 -c "import json,sys; d=json.load(sys.stdin); rs=d.get('reviews',[]); print('server-reviews:', len(rs)); print('sample:', rs[0]['reviewer'] if rs else '—', '|', rs[0]['photoKey'][:60] if rs else '')"

echo "=== 3) fresh console check (cleared) ==="
agent-browser console --clear >/dev/null 2>&1
agent-browser errors --clear >/dev/null 2>&1
agent-browser reload >/dev/null 2>&1; sleep 2
agent-browser eval "(()=>{const b=[...document.querySelectorAll('main button')].find(x=>/ثبت مرور نام‌دار/.test(x.textContent||''));if(b)b.click();return 'ok'})()" 2>/dev/null
sleep 1
agent-browser eval "document.querySelector('[role=dialog]') ? 'dialog-open' : 'no-dialog'" 2>/dev/null
agent-browser console 2>/dev/null | grep -iE "error|warn" | head -6
agent-browser errors 2>/dev/null | head -6
echo "(empty = clean)"

echo "=== 4) assistant answer date verification ==="
agent-browser open "http://localhost:3000/#assistant" >/dev/null 2>&1; sleep 2.5
agent-browser eval "(()=>{const inp=[...document.querySelectorAll('main input,main textarea')].find(i=>i.offsetParent);const st=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;st.call(inp,'تاریخ دقیق عملیات والفجر ۱ چه بود و نتیجه آن چه بود؟');inp.dispatchEvent(new Event('input',{bubbles:true}));const btn=[...document.querySelectorAll('main button')].find(b=>/ارسال/.test(b.textContent||''));btn.click();return 'sent'})()" 2>/dev/null
sleep 9
agent-browser eval "(()=>{const t=document.querySelector('main').innerText;const m=t.match(/والفجر ۱[^\\n]{0,120}/g)||[];return JSON.stringify({frags:m.slice(0,3),hasFarvardinDate:/۲۱ فروردین ۱۳۶۲/.test(t),noRawAsterisk:!t.includes('**')})})()" 2>/dev/null
