#!/bin/bash
# ─── فاز ۱۴ / کار ۵+۱ — جست‌وجوی وب: پرتره‌های جدید رهبران + عکس آرشیوی هر عملیات شاخص ───
cd /home/z/my-project/scripts/imgsearch || exit 1
run_one() {
  local slug="$1" query="$2" f="$1.json"
  if [ -s "$f" ] && grep -q '"original_url"' "$f" 2>/dev/null; then echo "[skip] $slug"; return 0; fi
  echo "[run ] $slug — $query"
  timeout 170 z-ai image-search -q "$query" --count 6 -o "$f" >/dev/null 2>&1
  if grep -q '"original_url"' "$f" 2>/dev/null; then echo "[done] $slug"; else echo "[FAIL] $slug"; rm -f "$f"; fi
  sleep 2
}
run_one "ld-khomeini2"  "امام خمینی پرتره رسمی چهره"
run_one "ld-khamenei2"  "پرتره رسمی رهبر انقلاب آیت الله خامنه ای"
run_one "op-fathmobin"  "عملیات فتح المبین عکس رزمندگان آرشیو دفاع مقدس"
run_one "op-baytalmoghaddas" "عملیات بیت المقدس آزادسازی خرمشهر عکس رزمندگان"
run_one "op-ramadan"    "عملیات رمضان ۱۳۶۱ جبهه شلمچه عکس رزمندگان"
run_one "op-kheibar"    "عملیات خیبر هور الهویزه عکس رزمندگان قایق"
run_one "op-badr"       "عملیات بدر ۱۳۶۳ هور الدلمج عکس رزمندگان"
run_one "op-valfajr8"   "عملیات والفجر ۸ فاو عکس رزمندگان دفاع مقدس"
run_one "op-karbala4"   "عملیات کربلای ۴ ام الرصاص عکس دفاع مقدس"
run_one "op-karbala5"   "عملیات کربلای ۵ شلمچه عکس رزمندگان"
run_one "op-mersad"     "عملیات مرصاد ۱۳۶۷ عکس دفاع مقدس"
run_one "op-martyrs"    "شهدای دفاع مقدس سربند یا زهرا عکس رزمندگان آرشیو"
echo FINISHED
