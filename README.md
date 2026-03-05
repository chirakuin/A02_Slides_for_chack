# Slides for Check

レビュー用HTMLプレゼンテーションをGitHub Pagesで公開・管理するリポジトリ。

- **Pages URL**: https://chirakuin.github.io/A02_Slides_for_chack/
- 目次ページから各プレゼンテーションにアクセスできる

## 公開する

```bash
./publish.sh /path/to/presentation.html
```

以下が自動で行われる:
1. HTMLをリポジトリにコピー
2. フレームワークパスの書き換え
3. 書き込み・PDF機能（annotation.js）の挿入
4. コミット & プッシュ
5. 目次ページの自動更新（GitHub Actions）

公開URL: `https://chirakuin.github.io/A02_Slides_for_chack/{ファイル名}.html`

## 削除する

```bash
git rm {ファイル名}.html
git commit -m "Remove {ファイル名}.html"
git push origin main
```

pushすると目次から自動で消える。

## 閲覧時の機能

### 書き込み

右上ツールバーの「✏️ 書き込み」で描画モードをONにすると、スライド上にペンで書き込みできる。

| ボタン | 機能 |
|--------|------|
| ✏️ 書き込み | 描画モード ON/OFF |
| カラーピッカー | ペン色変更 |
| スライダー | 太さ 1〜20（刻み0.5） |
| 🧹 | 消しゴム |
| 🗑 | 現在スライドの書き込みをクリア |
| 📄 PDF | PDF出力（下記参照） |

書き込みはスライドごとに保持される（ページ送りしても戻ると残る）。

### PDF出力

📄 PDF ボタンから選択:
- **このスライドだけ** — 表示中の1枚をPDF化
- **全スライド** — 全ページをPDF化

書き込み内容もPDFに含まれる。Chrome の印刷設定で「背景のグラフィック」を有効にすること。

## ファイル構成

```
index.html                  — 目次ページ（自動生成・編集不要）
*.html                      — プレゼンテーション
framework/
  presentation.css          — スライドフレームワークCSS
  presentation.js           — スライドナビゲーションJS
  annotation.js             — 書き込み・PDF機能
publish.sh                  — 公開スクリプト
.github/workflows/
  update-index.yml          — 目次自動更新
.nojekyll                   — Jekyll無効化（削除しないこと）
```

## Claude Code メモリ

このプロジェクトの学習事項・作業履歴は以下に永続保存される:
`~/.claude/projects/-Users-cc-Documents-Code-000-business-581-Slides-for-check/memory/MEMORY.md`
