# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

HTMLプレゼンテーションをGitHub Pagesで公開・管理するためのリポジトリ。
レビュー用にスライドを一時公開し、不要になったら削除する運用。

- **GitHub リポジトリ**: https://github.com/chirakuin/A02_Slides_for_chack.git
- **GitHub Pages URL**: https://chirakuin.github.io/A02_Slides_for_chack/
- **Pages設定**: `main` ブランチ / ルート(`/`) / legacy デプロイ

## HTMLを公開する手順

### publish.sh（推奨）

```bash
./publish.sh /path/to/presentation.html
```

1コマンドで以下を自動実行:
- HTMLをリポジトリにコピー
- フレームワークパス書き換え（`../../../framework/` → `framework/`）
- 書き込み機能（annotation.js）の挿入
- コミット & プッシュ
- `index.html`（目次）は GitHub Actions が自動更新

公開URL: `https://chirakuin.github.io/A02_Slides_for_chack/{ファイル名}.html`

### 手動で行う場合

1. HTMLをリポジトリにコピー
2. フレームワークパスを `framework/` に書き換え
3. `<script src="framework/presentation.js">` の直後に `<script src="framework/annotation.js">` を追加
4. `git add` → `git commit` → `git push origin main`

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

## 書き込み機能

`framework/annotation.js` がスライド上にペン描画レイヤーを提供する。右上ツールバーでON/OFF。
印刷時（@media print）は自動非表示。

## PDF化

- **ブラウザ**: GitHub Pages URL を開き `Cmd+P` →「PDFとして保存」。Chrome で「背景のグラフィック」を有効にすること
- **Playwright**: `page.pdf({ format: 'A4', landscape: true, printBackground: true })` で全スライドをPDF出力可能

## Claude Code メモリ

このプロジェクトの学習事項・作業履歴は以下に永続保存される:
`~/.claude/projects/-Users-cc-Documents-Code-000-business-581-Slides-for-check/memory/MEMORY.md`
