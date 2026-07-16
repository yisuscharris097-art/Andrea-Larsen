#!/bin/bash
# Descarga las galerías completas de los listings desde el CDN del MLS
# (content.mediastg.net, patrón {board}/{cover}/{cover}-{n}.jpg) y las
# optimiza a 1400px q70. Uso: bash scripts/fetch-galleries.sh
set -u
REPO="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$REPO/public/oc/gal"
mkdir -p "$OUT"

# slug board/cover
LISTINGS="
71-morningside-road 105320/109039
210-gull-road 105320/117834
522-waverly-blvd 105320/116278
905-907-brighton-pl 105320/109451
114-wesley-road 105320/109033
1-leyte-ln 105320/118485
6-walnut-road 105320/108987
3213-bayland-dr 105320/117392
907-brighton-pl-2 105320/109448
1100-central-ave 105320/110881
40-sunset-blvd 105320/116682
32-central-ave 105320/114136
855-4th-street-2 105320/113999
5606-pacific-ave 105320/116344
901-gardens-pkwy 105320/117744
302-e-13th-avenue 105291/45139
39-spruce-road 105320/118173
315-bay-ave 105320/117711
857-st-charles-pl-1 105320/118347
17-creek-view-ln 105320/116235
"

echo "$LISTINGS" | while read -r slug ref; do
  [ -z "$slug" ] && continue
  cover="${ref##*/}"
  dir="$OUT/$slug"
  mkdir -p "$dir"
  found=0
  misses=0
  for n in $(seq 1 60); do
    [ $found -ge 40 ] && break
    [ $misses -ge 14 ] && break
    url="https://content.mediastg.net/dyna_images/mls/${ref}/${cover}-${n}.jpg"
    tmp="$dir/raw-$n.jpg"
    code=$(curl -s -o "$tmp" -w "%{http_code}" "$url")
    if [ "$code" = "200" ] && [ -s "$tmp" ]; then
      found=$((found+1))
      misses=0
      sips -s format jpeg -s formatOptions 70 -Z 1400 "$tmp" --out "$dir/$(printf %02d $found).jpg" >/dev/null 2>&1
      rm -f "$tmp"
    else
      rm -f "$tmp"
      misses=$((misses+1))
    fi
  done
  echo "$slug: $found photos"
done
echo DONE
