#!/bin/bash
S=/tmp/render/shots
echo "=== 1) mazar image URLs + alts ==="
agent-browser open "http://localhost:3000/#memories" >/dev/null 2>&1; sleep 2.5
agent-browser eval "(()=>{const imgs=[...document.querySelectorAll('main img')].filter(i=>/مزار|آرامگاه|گلزار|قیبر|قبر|بهشت/.test((i.alt||'')+(i.src||'')));return JSON.stringify(imgs.slice(0,20).map(i=>({alt:(i.alt||'').slice(0,35),host:new URL(i.src).host,path:new URL(i.src).pathname.slice(0,60)})))})()" 2>/dev/null

echo "=== 2) all memory section thumbnails (first 10, any img in main) ==="
agent-browser eval "(()=>{const imgs=[...document.querySelectorAll('main img')];return JSON.stringify(imgs.slice(0,10).map(i=>({alt:(i.alt||'').slice(0,40),path:new URL(i.src).pathname.slice(0,70)})))})()" 2>/dev/null

echo "=== 3) high-res crop of mazar rows ==="
agent-browser eval "(()=>{const h=[...document.querySelectorAll('main h3,main div')].find(e=>e.textContent.trim().startsWith('تصاویر مزار')||/تصاویر مزار/.test(e.textContent.slice(0,40)));if(h){h.scrollIntoView();return 'ok'}return 'nf'})()" 2>/dev/null
sleep 1
agent-browser screenshot $S/mazar-rows.png >/dev/null 2>&1
python3 - <<'EOF'
from PIL import Image
im=Image.open('/tmp/render/shots/mazar-rows.png')
W,H=im.size
im.crop((60,60,int(W*0.85),int(H*0.62))).save('/tmp/render/shots/crop-mazar.png')
print('ok')
EOF

echo "=== 4) admin submit test ==="
agent-browser open "http://localhost:3000/#admin" >/dev/null 2>&1; sleep 2
agent-browser eval "(()=>{const inputs=[...document.querySelectorAll('main input,main textarea')];inputs.forEach(i=>{const st=Object.getOwnPropertyDescriptor(i.tagName==='TEXTAREA'?window.HTMLTextAreaElement.prototype:window.HTMLInputElement.prototype,'value').set;st.call(i,'تست انتشار محتوای آزمایشی QA');i.dispatchEvent(new Event('input',{bubbles:true}))});const b=[...document.querySelectorAll('main button')].find(x=>/ثبت در پایگاه/.test(x.textContent||''));if(b){b.click();return 'submitted'}return 'no-btn'})()" 2>/dev/null
sleep 1.5
agent-browser eval "(()=>{const t=[...document.querySelectorAll('[data-sonner-toast],[role=status],main div')].filter(e=>/ثبت|ذخیر|موفق|خطا/.test(e.textContent||'')&&e.textContent.length<150).slice(0,3).map(e=>e.textContent.trim().slice(0,90));return JSON.stringify(t)})()" 2>/dev/null

echo "=== 5) assistant markdown final check (long wait) ==="
agent-browser open "http://localhost:3000/#assistant" >/dev/null 2>&1; sleep 2.5
agent-browser eval "(()=>{const inp=[...document.querySelectorAll('main input,main textarea')].find(i=>i.offsetParent);if(!inp)return 'no-input';const st=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;st.call(inp,'عملیات فکه چه نتیجه‌ای داشت؟');inp.dispatchEvent(new Event('input',{bubbles:true}));const btn=[...document.querySelectorAll('main button')].find(b=>/ارسال/.test(b.textContent||''));if(!btn)return 'no-btn';btn.click();return 'sent'})()" 2>/dev/null
sleep 6
agent-browser eval "(()=>{const t=document.querySelector('main').innerText;if(!/\*\*/.test(t))return JSON.stringify({asterisks:false,hasAnswer:/فکه|والفجر/.test(t)});const m=t.match(/\*\*[^*]+\*\*/);return JSON.stringify({asterisks:true,sample:m&&m[0]})})()" 2>/dev/null

echo "=== 6) final console + network sweep ==="
agent-browser errors 2>/dev/null | head -12
agent-browser network requests 2>/dev/null | grep -vE "200|206|304|_next|\.js|\.css|\.svg" | head -12
