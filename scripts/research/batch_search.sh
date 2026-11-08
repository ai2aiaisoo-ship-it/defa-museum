#!/bin/bash
# Batch web-search for martyr memoirs & remaining burial info via z-ai CLI
cd /home/z/my-project/scripts/research || exit 1

declare -A Q=(
  [jahanara-mem]="خاطرات شهید محمدعلی جهان آرا خرمشهر"
  [babaei-mem]="خاطرات شهید عباس بابایی"
  [bagheri-mem]="خاطرات شهید حسن باقری"
  [kaveh-mem]="خاطرات شهید محمود کاوه"
  [falahi-mem]="خاطرات شهید ولی الله فلاحی"
  [vazvaei-mem]="خاطرات شهید محسن وزوایی"
  [doran-mem]="خاطرات شهید عباس دوران"
  [rajaei-mem]="خاطرات شهید رجایی باهنر"
  [daghayeghi-mem]="خاطرات شهید اسماعیل دقایقی"
  [yaghchian-mem]="خاطرات شهید مرتضی یاغچیان"
  [redanipour-mem]="خاطرات و وصیت شهید مصطفی ردانی پور"
  [hashemi-mem]="خاطرات شهید علی هاشمی دلاور هور"
  [namjou-mem]="خاطرات شهید موسی نامجو"
  [kolahdooz-mem]="خاطرات شهید یوسف کلاهدوز"
  [chamran-mem]="خاطرات شهید چمران جبهه"
  [hemmet-mem]="خاطرات شهید همت از زبان همرزمان"
  [babaei-grave]="مزار شهید عباس بابایی قزوین گلزار شهدا آدرس"
  [bagheri-grave]="شهید حسن باقری محل دفن بهشت زهرا قطعه"
  [doran-grave]="شهید عباس دوران محل دفن گورستان ملایه آبادان"
  [mahdi-bakri-grave]="مزار شهید مهدی باکری ارومیه گلزار"
  [kharrazi-date]="شهید حسین خرازی تاریخ شهادت اسفند ۱۳۶۵ شلمچه"
  [daghayeghi-grave]="مزار شهید اسماعیل دقایقی امیدیه"
)

run_one() {
  local slug="$1"; local query="$2"
  local f="/home/z/my-project/scripts/research/${slug}.json"
  if [ -s "$f" ]; then echo "[skip] $slug"; return 0; fi
  timeout 60 z-ai function -n web_search -a "{\"query\": \"$query\", \"num\": 8}" > "$f" 2>/dev/null
  if [ -s "$f" ]; then echo "[done] $slug"; else echo "[FAIL] $slug"; fi
}
export -f run_one

printf '%s\n' "${!Q[@]}" | xargs -P 3 -I{} bash -c 'run_one "{}" "${Q[{}]}"; sleep 2'
echo "=== SUMMARY ==="
for slug in "${!Q[@]}"; do
  f="/home/z/my-project/scripts/research/${slug}.json"
  if [ -s "$f" ] && grep -q '"url"' "$f"; then echo "OK $slug"; else echo "MISS $slug"; fi
done | sort
