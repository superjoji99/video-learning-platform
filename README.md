# 動画学習プラットフォーム (video-learning-platform)

会員限定で動画を配信する Web アプリケーション。自作の学習動画を「特定の数十〜数百人だけに限定公開」する用途を想定し、認証・コンテンツ管理・視聴までを Next.js で実装しています。

組込み Linux／C 言語で約 23 年開発してきたエンジニアが、モダンな Web 開発を学び直す一環として設計・実装したプロジェクトです。開発には AI ツールも活用していますが、構成・データモデル・認証まわりは自分で理解したうえで組み立てています。

## 主な機能

- **認証**：better-auth によるログイン／セッション管理とアクセス制御
- **管理画面**：コース・チャプター単位の作成／編集（サーバーアクション）
- **動画視聴**：YouTube 連携による限定動画の配信
- 会員向けページと管理者向けページをルートグループで分離
- **テスト**：Vitest によるユニットテスト（バリデーション・認証ヘルパー・管理アクション 等）

## 技術スタック

| 領域 | 使用技術 |
|---|---|
| フレームワーク | Next.js 16（App Router）/ React 19 |
| 言語 | TypeScript |
| 認証 | better-auth |
| DB / ORM | Drizzle ORM + libSQL（@libsql/client） |
| UI | Tailwind CSS v4 / shadcn/ui / Base UI |
| テスト | Vitest |

## ディレクトリ構成

```
src/
  app/
    (auth)/   認証まわりのページ
    (main)/   会員向けページ
    admin/    管理画面
    api/      API ルート
  components/ UI コンポーネント（ui / admin）
  lib/        認証ヘルパー・バリデーション・YouTube 連携 など（__tests__ 同梱）
```

## セットアップ

```bash
npm install                  # 依存インストール
# .env.local を作成し、DB 接続情報・認証シークレット等を設定
npx drizzle-kit push         # DB マイグレーション
npm run dev                  # 開発サーバー起動
```

## テスト

```bash
npm run test        # 一括実行
npm run test:watch  # 監視モード
```
