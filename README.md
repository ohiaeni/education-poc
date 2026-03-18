# education-poc

教員が自身の授業で使用する教材を作成するためのツールのPoCを作成するリポジトリです。

## 🔧 必要なもの（Prerequisites）

- Node.js 20 以上
- npm（Node.js に同梱）

## 🚀 はじめのセットアップ

```bash
# リポジトリをクローン
git clone <repository-url>
cd education-poc

# 依存関係をインストール
npm ci

# p5 / Bootstrap のライブラリをコピー（必要なファイルを simulations/lib/ に配置）
npm run setup
```

## 🧪 テスト実行

### 単体テスト（Vitest）

```bash
npm test
# または
npm run test:unit
```

### E2E テスト（Playwright）

Playwright はブラウザバイナリが必要です。初回またはブラウザがない環境では以下を実行してください。

```bash
npx playwright install
```

その後、E2E テストを実行します。

```bash
npm run test:e2e
```

特定のテストだけを実行する場合（例: UI スナップショット）:

```bash
npm run test:e2e:ui
npm run test:e2e:e2e
```

## 📁 主要なフォルダ構成

- `simulations/` - シミュレーションの HTML/CSS/JS など
- `tests/` - Vitest（単体テスト）と Playwright（E2E テスト）
