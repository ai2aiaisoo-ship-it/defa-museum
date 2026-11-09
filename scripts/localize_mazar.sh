#!/bin/bash
# دانلود همه تصاویر مزار به حافظه محلی — حذف وابستگی به CDN خارجی
set -u
DEST=/home/z/my-project/public/images/mazar
mkdir -p "$DEST"
BASE="https://z-cdn.chatglm.cn/image-search-mcp/images-ppt"
declare -A FILES=(
  [d0df7b1b6213.jpeg]=chamran
  [bceb0d266f84.jpg]=tir72-arch
  [c78f2dadf4ee.jpg]=c130-infographic
  [831aef135f72.jpeg]=jahandar
  [135289c1f9f1.jpg]=daghayeghi
  [c8bba0c5aa8d.jpeg]=vazvaei
  [0acd17ee7aab.jpg]=kaveh
  [6faa1f7b5c3e.jpg]=redanipour
  [8261128077b6.jpg]=bagheri-rejected
  [f693c80fd09f.jpeg]=bakri-mehdi
  [5689e4de2f8d.jpg]=bakri-hamid
  [903bde676a95.jpeg]=hashemi-ali
  [1b7158abf2b8.jpeg]=hammet
  [f1ccdbae747a.jpg]=kharrazi
  [1536506b9dc6.jpg]=babaei
)
fail=0
for hash in "${!FILES[@]}"; do
  name="${FILES[$hash]}"
  out="$DEST/$hash"
  if [ -s "$out" ]; then echo "[skip] $name ($hash)"; continue; fi
  code=$(curl -s -o "$out" -w "%{http_code}" --max-time 40 "$BASE/$hash")
  size=$(stat -c%s "$out" 2>/dev/null || echo 0)
  if [ "$code" = "200" ] && [ "$size" -gt 5000 ]; then
    echo "[ok]   $name -> $hash ($size bytes)"
  else
    echo "[FAIL] $name code=$code size=$size"; rm -f "$out"; fail=1
  fi
  sleep 1
done
echo "---"; ls -la "$DEST" | wc -l
exit $fail
