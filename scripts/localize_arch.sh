#!/bin/bash
# ۱) پاک‌سازی ردیف تست curl از فایل سرور
echo '{"updatedAt":"1970-01-01T00:00:00.000Z","reviews":[]}' > /home/z/my-project/db/mazar-reviews.json

# ۲) شمارش هش‌های یکتای CDN در کل داده‌های برنامه
cd /home/z/my-project
HASHES=$(grep -rhoE "image-search-mcp/images-ppt/[A-Za-z0-9]+\.(jpg|jpeg|png|webp)" src/data src/components | sed -E 's|.*/||' | sort -u)
N=$(echo "$HASHES" | wc -l)
echo "unique CDN images in app data: $N"
mkdir -p public/images/arch
FAIL=0
for h in $HASHES; do
  out="public/images/arch/$h"
  if [ -s "$out" ]; then continue; fi
  code=$(curl -s -o "$out" -w "%{http_code}" --max-time 40 "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/$h")
  size=$(stat -c%s "$out" 2>/dev/null || echo 0)
  if [ "$code" = "200" ] && [ "$size" -gt 3000 ]; then
    echo "[ok] $h ($size)"
  else
    echo "[FAIL] $h code=$code size=$size"; rm -f "$out"; FAIL=1
  fi
  sleep 0.4
done
echo "downloaded total: $(ls public/images/arch | wc -l)"
exit $FAIL
