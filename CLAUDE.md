# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

HTMLプレゼンテーションをGitHub Pagesで公開・管理するためのリポジトリ。
レビュー用にスライドを一時公開し、不要になったら削除する運用。

- **GitHub リポジトリ**: https://github.com/chirakuin/A02_Slides_for_chack.git
- **GitHub Pages URL**: https://chirakuin.github.io/A02_Slides_for_chack/
- **Pages設定**: `main` ブランチ / ルート(`/`) / legacy デプロイ

## HTMLを公開する手順

1. **フレームワークを同梱する**: 元HTMLが `../../../framework/` を参照している場合、`framework/` にコピーしてパスを書き換える
   - フレームワーク元: `~/Documents/Code/000_business/500_BrainStorming/007_プレゼン生成パイプライン_codex/framework/`
   - `presentation.css` と `presentation.js` の2ファイル
2. **`index.html` として配置する**: GitHub Pages のエントリポイントは `index.html`
3. **コミット & プッシュ**: `git add` → `git commit` → `git push origin main`
4. **反映確認**: 1〜2分後に https://chirakuin.github.io/A02_Slides_for_chack/ で確認

### 複数HTMLを公開する場合

`index.html` はトップページ用。追加のHTMLは別名で配置し、`https://chirakuin.github.io/A02_Slides_for_chack/{ファイル名}.html` でアクセスできる。

## HTMLを削除（非公開化）する手順

1. 対象のHTMLファイルを `git rm` で削除
2. 不要になったフレームワークファイルも `git rm framework/` で削除
3. コミット & プッシュ
4. 全ファイル削除後もPagesは有効のまま残る（404になるだけ）

### Pages自体を無効化する場合

```bash
gh api repos/chirakuin/A02_Slides_for_chack/pages -X DELETE
```

### Pages を再度有効化する場合

```bash
gh api repos/chirakuin/A02_Slides_for_chack/pages -X POST -f "build_type=legacy" -f "source[branch]=main" -f "source[path]=/"
```

## スライドHTML の構造規約

- 各スライドは `<div class="slide ...">` で定義
- スライドタイプ: `title-slide`、`divider-slide`、`content-slide`
- レイアウトクラス: `layout-stat-hero-grid`、`diagram-flow-h`、`diagram-swimlane`、`diagram-bullets-v`、`data-table` 等
- 共通要素: `.slide-header` > `h3`、`.slide-description`、`.slide-body`、`.slide-source`
- 外部ライブラリ(CDN): Chart.js v4、D3.js v7、Mermaid.js v10
- フォント: Google Fonts（Inter + Noto Sans JP）
- コンテンツは日本語（`lang="ja"`）

## PDF化

ブラウザで GitHub Pages URL を開き `Cmd+P` →「PDFとして保存」。Chrome の印刷設定で「背景のグラフィック」を有効にすること。

## Claude Code メモリ

このプロジェクトの学習事項・作業履歴は以下に永続保存される:
`~/.claude/projects/-Users-cc-Documents-Code-000-business-581-Slides-for-check/memory/MEMORY.md`
