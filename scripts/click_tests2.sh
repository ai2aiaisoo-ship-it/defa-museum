#!/bin/bash
S=/tmp/render/shots
echo "=== A) find remaining 'در انتظار مرور' item ==="
agent-browser open "http://localhost:3000/#memories" >/dev/null 2>&1; sleep 2
agent-browser eval "(()=>{const all=[...document.querySelectorAll('main *')].filter(e=>e.children.length===0&&/در انتظار مرور/.test(e.textContent||''));return all.map(e=>{let card=e.closest('[class*=card],[class*=border],li,article');let ctx=card?(card.textContent||'').slice(0,150):'';return 'ITEM: '+ctx})[0]||'none'})()" 2>/dev/null

echo "=== B) E2E reviewer flow: fill+check+submit ==="
agent-browser eval "(()=>{const b=[...document.querySelectorAll('main button')].find(x=>/🧑|کارتابل/.test(x.textContent||''));if(b){b.click();return 'opened'}return 'no'})()" 2>/dev/null
sleep 1
agent-browser eval "(()=>{const inputs=[...document.querySelectorAll('[role=dialog] input,[role=dialog] textarea')];const nameI=inputs.find(i=>/کارشناس/.test(i.placeholder||''));if(nameI){const st=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;st.call(nameI,'کارشناس آزمون QA');nameI.dispatchEvent(new Event('input',{bubbles:true}));}const ta=inputs.find(i=>i.tagName==='TEXTAREA');if(ta){const st2=Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype,'value').set;st2.call(ta,'بررسی قیقی و مطابقت با منبع رسمی');ta.dispatchEvent(new Event('input',{bubbles:true}));}const cb=[...document.querySelectorAll('[role=dialog] input[type=checkbox]')];cb.forEach(c=>{if(!c.checked){c.click()}});return 'filled inputs='+inputs.length+' checkboxes='+cb.length})()" 2>/dev/null
sleep 0.5
agent-browser eval "(()=>{const btn=[...document.querySelectorAll('[role=dialog] button')].find(b=>/ثبتِ مرور|ثبت مرور/.test(b.textContent||''));if(btn){btn.click();return 'submitted'}return 'no submit btn: '+[...document.querySelectorAll('[role=dialog] button')].map(b=>b.textContent.trim().slice(0,20)).join(',')})()" 2>/dev/null
sleep 1.5
agent-browser eval "(()=>{const els=[...document.querySelectorAll('main *')].filter(e=>e.children.length===0&&/در انتظار مرور/.test(e.textContent||''));const toast=[...document.querySelectorAll('[data-sonner-toast],[role=status],li')].filter(e=>/مرور|ثبت/.test(e.textContent||'')).slice(0,2).map(e=>e.textContent.slice(0,80));return JSON.stringify({pendingNow:els.length,toasts:toast})})()" 2>/dev/null

echo "=== C) suspicious text extraction ==="
agent-browser open "http://localhost:3000/#martyrs" >/dev/null 2>&1; sleep 2
agent-browser eval "(()=>{const t=document.body.innerText;const hits={};['برزشته','برجسته','پویه','پویش','سنان','شاهده'].forEach(w=>{hits[w]=(t.match(new RegExp(w,'g'))||[]).length});const m=t.match(/.{25}برزشته.{25}/);return JSON.stringify({hits,ctx:m&&m[0]})})()" 2>/dev/null
agent-browser open "http://localhost:3000/#memories" >/dev/null 2>&1; sleep 2
agent-browser eval "(()=>{const t=document.body.innerText;const hits={};['سنان','پویه','هیئت‌سنجده','متأظل','دستِکاری'].forEach(w=>{hits[w]=(t.match(new RegExp(w,'g'))||[]).length});const ctxs=['سنان','متأظل'].map(w=>{const m=t.match(new RegExp('.{20}'+w+'.{40}'));return m&&m[0]});return JSON.stringify({hits,ctxs})})()" 2>/dev/null
agent-browser open "http://localhost:3000/#home" >/dev/null 2>&1; sleep 2
agent-browser eval "(()=>{const t=document.body.innerText;const m=t.match(/با زهرا.{0,200}/);const chips=[...document.querySelectorAll('main *')].filter(e=>e.children.length===0&&/خارج از/.test(e.textContent||'')).map(e=>e.textContent);return JSON.stringify({ticker:m&&m[0].slice(0,120),chips})})()" 2>/dev/null

echo "=== D) music play test ==="
agent-browser eval "(()=>{const b=[...document.querySelectorAll('button')].find(x=>/خاک سرخ/.test(x.textContent||''));if(b){b.click();return 'clicked khak-sorkh'}return 'nobtn'})()" 2>/dev/null
sleep 3
agent-browser eval "(()=>{const a=document.querySelector('audio');return a?JSON.stringify({paused:a.paused,currentTime:a.currentTime,duration:a.duration,src:a.currentSrc.slice(0,60)}):'no-audio'})()" 2>/dev/null

echo "=== E) console errors ==="
agent-browser errors 2>/dev/null | head -30
agent-browser console 2>/dev/null | grep -iE "error|warn|fail" | head -20
