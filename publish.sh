#!/bin/bash
# ============================================
# publish.sh - HTMLをGitHub Pages用に変換してpush
# ============================================
# 使い方: ./publish.sh <HTMLファイルパス>
# 例:     ./publish.sh /path/to/new-presentation.html
#         ./publish.sh ../580_Slides/007_xxx/output.html
# ============================================

set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ $# -eq 0 ]; then
  echo "使い方: $0 <HTMLファイルパス>"
  echo "例:     $0 /path/to/presentation.html"
  exit 1
fi

SRC="$1"
if [ ! -f "$SRC" ]; then
  echo "エラー: ファイルが見つかりません: $SRC"
  exit 1
fi

FILENAME="$(basename "$SRC")"

if [ "$FILENAME" = "index.html" ]; then
  echo "エラー: index.html は目次ページ用のため使用できません。別名にしてください。"
  exit 1
fi

echo "==> $FILENAME を公開準備中..."

# リポジトリにコピー
cp "$SRC" "$REPO_DIR/$FILENAME"

# フレームワークパスを書き換え（../../../framework/ → framework/）
sed -i '' 's|"\.\./\.\./\.\./framework/|"framework/|g' "$REPO_DIR/$FILENAME"
sed -i '' "s|'\.\./\.\./\.\./framework/|'framework/|g" "$REPO_DIR/$FILENAME"

# annotation.js が未挿入なら追加（presentation.js の直後にキャッシュバスター付きで挿入）
CACHE_V="v=$(date +%s)"
if ! grep -q 'annotation.js' "$REPO_DIR/$FILENAME"; then
  sed -i '' "/<script src=\"framework\/presentation\.js\"><\/script>/a\\
\\
  <!-- Annotation Layer -->\\
  <script src=\"framework/annotation.js?${CACHE_V}\"></script>" "$REPO_DIR/$FILENAME"
fi

# Git add, commit, push
cd "$REPO_DIR"
git add "$FILENAME"
git commit -m "Add $FILENAME"
git push origin main

echo ""
echo "==> 公開完了!"
echo "    URL: https://chirakuin.github.io/A02_Slides_for_chack/$FILENAME"
echo "    目次は GitHub Actions が自動更新します"
