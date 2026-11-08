#!/bin/bash
cd /home/z/my-project/scripts/imgsearch || exit 1
declare -A Q=(
  [mz-chamran]="مزار شهید چمران بهشت زهرا قطعه ۲۴"
  [mz-rajaei]="مزار شهید رجایی و باهنر بهشت زهرا"
  [mz-falahi]="آرامگاه شهید فلاحی و شهدای سانحه هواپیما بهشت زهرا"
  [mz-jahanara]="مزار شهید جهان آرا بهشت زهرا"
  [mz-vazvaei]="مزار شهید محسن وزوایی بهشت زهرا قطعه ۲۶"
  [mz-kaveh]="مزار شهید محمود کاوه گلزار شهدا مشهد"
  [mz-esfahan]="گلزار شهدای گلستان شهدا اصفهان دفاع مقدس"
  [mz-bagheri]="مزار شهید حسن باقری بهشت زهرا قطعه ۲۴"
  [mz-urumiyeh]="گلزار شهدای ارومیه آرامگاه شهید باکری"
  [mz-hemmet]="مزار شهید همت شهرضا"
  [mz-kharrazi]="مزار شهید حسین خرازی اصفهان گلستان شهدا"
  [mz-babaei]="آرامگاه شهید عباس بابایی گلزار شهدا قزوین"
  [mz-doran]="گورستان ملایه آبادان گلزار شهدا"
  [mz-daghayeghi]="مزار شهید اسماعیل دقایقی گلزار شهدا امیدیه"
  [mz-hashemi]="یادمان شهدای قرارگاه نصرت بهشت آباد اهواز"
  [mz-behzahra]="گلزار شهدا بهشت زهرا تهران قطعه ۲۴"
  [mz-omidieh]="گلزار شهدای امیدیه خوزستان"
)
run_one() {
  local slug="$1"; local query="$2"
  local f="/home/z/my-project/scripts/imgsearch/${slug}.json"
  if [ -s "$f" ] && grep -q '"original_url"' "$f" 2>/dev/null; then echo "[skip] $slug"; return 0; fi
  echo "[run ] $slug"
  timeout 170 z-ai image-search -q "$query" --count 4 -o "$f" >/dev/null 2>&1
  if grep -q '"original_url"' "$f" 2>/dev/null; then echo "[done] $slug"; else echo "[FAIL] $slug"; rm -f "$f"; fi
  sleep 3
}
for slug in "$@"; do
  [ -n "${Q[$slug]}" ] && run_one "$slug" "${Q[$slug]}"
done
echo FINISHED
