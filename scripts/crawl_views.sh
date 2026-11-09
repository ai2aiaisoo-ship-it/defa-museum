#!/bin/bash
# Systematic crawl of all museum views: DOM metrics + screenshot per view
mkdir -p /tmp/render/shots
VIEWS="home roots saddam-dossier hall-3d atlas timeline operations battle-maps experiences stats martyrs memories avini archive khorramshahr mersad war-of-cities tanker-war air-war naval-war iraq-ops mek-ops commanders forces equipment foreign resolutions gallery documentaries sources glossary assistant learn map-quiz search admin docs"
OUT=/tmp/render/view-metrics.txt
echo -e "view\tbrokenImg\ttotalImg\ttextLen\thOverflow\tnavCount\tbtnCount" > $OUT
for v in $VIEWS; do
  agent-browser open "http://localhost:3000/#$v" >/dev/null 2>&1
  sleep 2.2
  METRICS=$(agent-browser eval "
    (() => {
      const imgs=[...document.querySelectorAll('img')];
      const broken=imgs.filter(i=>i.complete && i.naturalWidth===0).length;
      const body=document.body;
      const hOver=body.scrollWidth > window.innerWidth+2 ? 1 : 0;
      const t=(document.querySelector('main')||body).innerText.length;
      const navs=document.querySelectorAll('nav a, nav button').length;
      const btns=document.querySelectorAll('main button').length;
      return broken+','+imgs.length+','+t+','+hOver+','+navs+','+btns;
    })()
  " 2>/dev/null | tr -d '"')
  echo -e "$v\t$METRICS" >> $OUT
  agent-browser screenshot /tmp/render/shots/$v.png >/dev/null 2>&1
done
echo "=== METRICS ==="
column -t -s$'\t' $OUT
echo "=== CONSOLE ERRORS ==="
agent-browser errors 2>/dev/null | head -40
