#!/bin/bash
# Batch web/image search with CORRECT query passing (no xargs env bug)
MODE="$1"; shift   # "web" or "img"
cd /home/z/my-project/scripts/research || exit 1

run_one() {
  local slug="$1"; local query="$2"; local outdir="$3"; local cmdtype="$4"
  local f="/home/z/my-project/scripts/${outdir}/${slug}.json"
  if [ -s "$f" ] && grep -q '"url"\|"original_url"' "$f" 2>/dev/null; then echo "[skip] $slug"; return 0; fi
  echo "[run ] $slug"
  if [ "$cmdtype" = "img" ]; then
    timeout 170 z-ai image-search -q "$query" --count 4 -o "$f" >/dev/null 2>&1
  else
    timeout 70 z-ai function -n web_search -a "{\"query\": \"$query\", \"num\": 8}" > "$f" 2>/dev/null
  fi
  if [ -s "$f" ] && grep -q '"url"\|"original_url"' "$f" 2>/dev/null; then echo "[done] $slug"; else echo "[FAIL] $slug"; rm -f "$f"; fi
}

if [ "$MODE" = "web" ]; then
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
  for slug in "${!Q[@]}"; do run_one "$slug" "${Q[$slug]}" "research" "web"; sleep 2; done
elif [ "$MODE" = "img" ]; then
  declare -A Q=(
    [rajaei]="پرتره شهید محمدعلی رجایی رئیس جمهور ایران"
    [bahonar]="پرتره شهید محمدجواد باهنر نخست وزیر"
    [falahi]="پرتره شهید ولی الله فلاحی سرلشکر ارتش"
    [fakoori]="پرتره شهید جواد فکوری"
    [namjou]="پرتره شهید موسی نامجو وزیر دفاع"
    [daghayeghi]="پرتره شهید اسماعیل دقایقی مهندس جنگی"
    [doran]="پرتره شهید خلبان عباس دوران فانتوم"
    [vazvaei]="پرتره شهید محسن وزوایی فرمانده"
    [kaveh]="پرتره شهید محمود کاوه سپاه"
    [redanipour]="پرتره شهید مصطفی ردانی پور"
    [kolahdooz]="پرتره شهید یوسف کلاهدوز سپاه"
    [bagheri]="پرتره شهید سید حسن باقری افشردی"
    [bakri-mehdi]="پرتره شهید مهدی باکری فرمانده لشکر عاشورا"
    [yaghchian]="پرتره شهید مرتضی یاغچیان"
    [hashemi-ali]="پرتره شهید علی هاشمی فرمانده سپاه ششم"
    [hammet]="پرتره شهید محمد ابراهیم همت لشکر ۲۷"
    [bakri-hamid]="پرتره شهید حمید باکری"
    [kharrazi]="پرتره واقعی عکس شهید حسین خرازی"
    [babaei]="پرتره شهید عباس بابایی خلبان"
  )
  # only run slugs passed as args
  for slug in "$@"; do
    [ -n "${Q[$slug]}" ] && run_one "$slug" "${Q[$slug]}" "imgsearch" "img"
    sleep 4
  done
fi
echo FINISHED
