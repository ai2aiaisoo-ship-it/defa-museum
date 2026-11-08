#!/bin/bash
# Batch image search for martyr portraits — runs queries in parallel (P=6)
# Each result saved to scripts/imgsearch/<slug>.json
cd /home/z/my-project/scripts/imgsearch || exit 1

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
  [hashemi-ali]="پرتره شهید علی هاشمی فرمانده قرارگاه فتح"
  [hammet]="پرتره شهید محمد ابراهیم همت لشکر ۲۷"
  [bakri-hamid]="پرتره شهید حمید باکری"
  [kharrazi]="پرتره واقعی عکس شهید حسین خرازی"
  [babaei]="پرتره شهید عباس بابایی خلبان"
)

run_one() {
  local slug="$1"; local query="$2"
  if [ -s "/home/z/my-project/scripts/imgsearch/${slug}.json" ] && grep -q '"success": true' "/home/z/my-project/scripts/imgsearch/${slug}.json"; then
    echo "[skip] $slug (cached)"
    return 0
  fi
  echo "[run ] $slug"
  timeout 170 z-ai image-search -q "$query" --count 5 -o "/home/z/my-project/scripts/imgsearch/${slug}.json" >/dev/null 2>&1
  local rc=$?
  if [ $rc -ne 0 ]; then echo "[FAIL] $slug rc=$rc"; else echo "[done] $slug"; fi
}
export -f run_one

# run with 6-way parallelism
printf '%s\n' "${!Q[@]}" | xargs -P 2 -I{} bash -c 'run_one "{}" "${Q[{}]}"; sleep 4'

echo "=== SUMMARY ==="
for slug in "${!Q[@]}"; do
  f="/home/z/my-project/scripts/imgsearch/${slug}.json"
  if [ -s "$f" ] && grep -q '"success": true' "$f"; then
    n=$(grep -o '"original_url"' "$f" | wc -l)
    echo "OK   $slug ($n images)"
  else
    echo "MISS $slug"
  fi
done | sort
