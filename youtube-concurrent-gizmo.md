# 動画講座プラットフォーム 実装計画

## Context

YouTube 動画埋め込みを使った Udemy 風の動画講座プラットフォームをゼロから構築する。
受講者は会員登録してログインすることでコースを閲覧できる（初期は無料）。
管理者（自分のみ）がコース・章を登録・編集できる管理画面も必要。

---

## 技術スタック

| 用途 | 選定 |
|------|------|
| フレームワーク | Next.js 15 (App Router) |
| 認証 | Better Auth |
| DB | Turso (分散 SQLite) |
| ORM | Drizzle ORM |
| スタイリング | Tailwind CSS + shadcn/ui |
| 動画 | YouTube iframe embed |
| デプロイ | Vercel |

---

## MVP スコープ（初期リリース）

1. 会員登録・ログイン（Better Auth）
2. コース一覧ページ
3. コース詳細ページ（章リスト）
4. 章別動画再生ページ（YouTube 埋め込み）
5. 管理者用コース・章 CRUD UI

決済・進捗トラッキング・クイズは将来対応。

---

## DB スキーマ（Drizzle）

```
users        (Better Auth が管理)
sessions     (Better Auth が管理)

courses
  id          TEXT PK
  title       TEXT NOT NULL
  description TEXT
  thumbnail   TEXT  ← YouTube サムネイル URL など
  published   INTEGER DEFAULT 0  ← 0=非公開, 1=公開
  created_at  INTEGER

chapters
  id          TEXT PK
  course_id   TEXT FK → courses.id
  title       TEXT NOT NULL
  youtube_url TEXT NOT NULL
  position    INTEGER  ← 表示順
  created_at  INTEGER
```

---

## ディレクトリ構成

```
src/
  app/
    (auth)/
      login/page.tsx
      register/page.tsx
    (main)/
      courses/
        page.tsx                          ← コース一覧
        [courseId]/
          page.tsx                        ← コース詳細
          chapters/[chapterId]/page.tsx   ← 動画再生
    admin/
      courses/
        page.tsx                          ← 管理: コース一覧
        new/page.tsx                      ← 新規コース作成
        [courseId]/edit/page.tsx          ← コース編集
        [courseId]/chapters/new/page.tsx  ← 章追加
        [courseId]/chapters/[chapterId]/edit/page.tsx
    api/
      auth/[...all]/route.ts              ← Better Auth ハンドラ
  lib/
    db.ts          ← Turso + Drizzle クライアント
    schema.ts      ← Drizzle スキーマ定義
    auth.ts        ← Better Auth 設定
  components/
    ui/            ← shadcn/ui コンポーネント
    CourseCard.tsx
    VideoPlayer.tsx
  middleware.ts    ← 認証保護（/admin, /courses/*）
```

---

## 実装ステップ

### Step 1: プロジェクト初期化
```bash
npx create-next-app@latest video-plat --typescript --tailwind --app --src-dir
```

### Step 2: 依存パッケージ追加
```bash
npm install better-auth drizzle-orm @libsql/client
npm install -D drizzle-kit
npx shadcn@latest init
```

### Step 3: 環境変数（`.env.local`）
```
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3000
```

### Step 4: Drizzle スキーマ + マイグレーション
- `src/lib/schema.ts` にテーブル定義
- `drizzle.config.ts` を作成
- `npx drizzle-kit push` で Turso に反映

### Step 5: Better Auth 設定
- `src/lib/auth.ts` に Better Auth 設定（メール+パスワード認証）
- `src/app/api/auth/[...all]/route.ts` にハンドラ

### Step 6: Middleware（ルート保護）
- `/courses/**`, `/admin/**` は認証済みのみアクセス可
- 未認証なら `/login` にリダイレクト
- `/admin/**` は管理者ロールのみ（Better Auth の role 機能）

### Step 7: UI ページ実装
1. ログイン・登録ページ
2. コース一覧ページ（CourseCard コンポーネント）
3. コース詳細ページ（章リスト）
4. 章別動画再生ページ（YouTube iframe）
5. 管理者ページ（コース・章 CRUD フォーム）

### Step 8: Server Actions で CRUD
- コース作成・更新・削除
- 章作成・更新・削除・並び順変更

---

## 認証フロー

- メールアドレス + パスワードで登録/ログイン
- Better Auth の `role` フィールドを使って admin を判定
- 管理者の初期設定は DB に直接 role='admin' を INSERT

---

## 検証方法

1. `npm run dev` でローカル起動
2. `/register` で会員登録 → `/login` でログイン → `/courses` でコース一覧表示を確認
3. DB に直接 role='admin' をセット → `/admin/courses/new` でコース作成・YouTube URL 登録
4. 作成したコースが一覧に表示されるか確認
5. 章を登録 → 動画再生ページで YouTube が正しく埋め込まれるか確認
6. 未ログイン状態で `/courses` アクセス → `/login` リダイレクトを確認
