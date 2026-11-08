#!/bin/bash
cd /home/z/my-project/scripts/research || exit 1
declare -A Q=(
  [chamran-mem2]="خاطره از شهید مصطفی چمران در جبهه سوسنگرد"
  [jahanara-mem2]="خاطره از شهید جهان آرا مقاومت ۳۴ روز خرمشهر"
  [kaveh-mem2]="خاطره از شهید محمود کاوه یگان ویژه"
  [rajaei-mem2]="خاطره از شهید رجایی سادگی"
  [kolahdooz-mem2]="خاطره از شهید کلاهدوز"
  [namjou-mem2]="خاطره از شهید نامجو وزیر دفاع"
  [daghayeghi-mem2]="خاطره از شهید دقایقی پل"
  [yaghchian-mem2]="خاطره از شهید یاغچیان"
  [hashemi-mem2]="خاطره از شهید علی هاشمی"
  [falahi-mem2]="خاطره از شهید فلاحی"
)
run_one() {
  local slug="$1"; local query="$2"
  local f="/home/z/my-project/scripts/research/${slug}.json"
  if [ -s "$f" ] && grep -q '"url"' "$f" 2>/dev/null; then echo "[skip] $slug"; return 0; fi
  echo "[run ] $slug"
  timeout 70 z-ai function -n web_search -a "{\"query\": \"$query\", \"num\": 8}" > "$f" 2>/dev/null
  if grep -q '"url"' "$f" 2>/dev/null; then echo "[done] $slug"; else echo "[FAIL] $slug"; rm -f "$f"; fi
  sleep 2
}
for slug in "${!Q[@]}"; do run_one "$slug" "${Q[$slug]}"; done
echo FINISHED
