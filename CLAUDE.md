# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

マーケティングOps AI導入戦略のプレゼンテーション資料（レビュー用）。単一HTMLファイル（`strategy.html`）で構成されるスライドデッキ。

## アーキテクチャ

- **単一ファイル構成**: `strategy.html` がプレゼンテーション全体（約1,450行、35枚超のスライド）
- **共有フレームワーク依存**: CSS/JSは `../../../framework/presentation.css` と `../../../framework/presentation.js` を参照（580_Slidesプロジェクト群と共通の基盤）
- **外部ライブラリ**: Chart.js v4（棒・折れ線グラフ）、D3.js v7、Mermaid.js v10（ダイアグラム）をCDNから読み込み
- **フォント**: Google Fonts（Inter + Noto Sans JP）

## スライド構造の規約

- 各スライドは `<div class="slide ...">` で定義
- スライドタイプ: `title-slide`、`divider-slide`、`content-slide`
- レイアウトクラス: `layout-stat-hero-grid`、`diagram-flow-h`、`diagram-swimlane`、`diagram-bullets-v`、`data-table` 等
- 共通要素: `.slide-header` > `h3`、`.slide-description`、`.slide-body`、`.slide-source`（出典）
- セクション間の遷移テキスト: `.transition-text`

## カスタムCSS

プレゼンテーション固有のスタイルは `<style>` タグ内に最小限（`.gate-task` スタイルのみ）。レイアウト・デザインの大部分はフレームワークCSSが担当。

## Chart.js の使い方

- `<canvas id="chartNN">` をスライド内に配置し、末尾の `<script>` ブロックで初期化
- グローバルデフォルト: Noto Sans JP、13px、色 #64748B
- チャートID命名: `chart14`、`chart17`、`chart33` 等（スライド番号に対応しない連番）

## 開発・確認方法

ローカルファイルとしてブラウザで直接開く。フレームワークファイルへの相対パスが正しく解決される環境が必要（`/Users/cc/Documents/Code/000_business/` 配下の配置を前提）。

## 言語

コンテンツは全て日本語。HTMLの `lang="ja"`。

## Claude Code メモリ

このプロジェクトの学習事項・作業履歴は以下に永続保存される:
`~/.claude/projects/-Users-cc-Documents-Code-000-business-581-Slides-for-check/memory/MEMORY.md`
