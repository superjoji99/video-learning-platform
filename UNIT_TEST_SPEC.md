# ユニットテスト仕様書

## 対象プロジェクト
動画講座プラットフォーム（Next.js 15 + Better Auth + Turso + Drizzle）

## テストフレームワーク
- **Vitest**（テスト実行）
- **@testing-library/react**（Reactコンポーネントのテスト）※将来対応

## 方針
- ユニットテストのみ（E2Eは対象外）
- 外部依存（DB・認証）はモックで差し替える
- ファイル配置：テスト対象ファイルと同階層に `__tests__/` を作るか `.test.ts` で並べる

---

## テスト対象一覧

### 1. YouTube URL ユーティリティ
**ファイル：** `src/lib/youtube.ts`

#### 関数：`extractYoutubeId(url: string): string | null`
YouTube の URL から動画 ID を抽出する。

| テストケース | 入力 | 期待する出力 |
|---|---|---|
| 通常の watch URL | `https://www.youtube.com/watch?v=abc123` | `"abc123"` |
| 短縮 URL（youtu.be） | `https://youtu.be/abc123` | `"abc123"` |
| 埋め込み URL | `https://www.youtube.com/embed/abc123` | `"abc123"` |
| クエリパラメータ付き | `https://www.youtube.com/watch?v=abc123&t=30s` | `"abc123"` |
| YouTube 以外の URL | `https://example.com/video` | `null` |
| 空文字 | `""` | `null` |
| 不正な文字列 | `"not a url"` | `null` |

#### 関数：`isValidYoutubeUrl(url: string): boolean`
YouTube の URL かどうかを判定する。

| テストケース | 入力 | 期待する出力 |
|---|---|---|
| 有効な watch URL | `https://www.youtube.com/watch?v=abc123` | `true` |
| 有効な短縮 URL | `https://youtu.be/abc123` | `true` |
| YouTube 以外 | `https://vimeo.com/abc` | `false` |
| 空文字 | `""` | `false` |

---

### 2. 認証ヘルパー
**ファイル：** `src/lib/auth-helpers.ts`

#### 関数：`isAdmin(session: Session | null): boolean`
ログインしているユーザーが管理者かどうかを判定する。

| テストケース | 入力 | 期待する出力 |
|---|---|---|
| role が admin | `{ user: { role: "admin" } }` | `true` |
| role が user | `{ user: { role: "user" } }` | `false` |
| セッションが null | `null` | `false` |
| role が未定義 | `{ user: {} }` | `false` |

---

### 3. コースのバリデーション
**ファイル：** `src/lib/validation.ts`

#### 関数：`validateCourseInput(input): { ok: boolean; errors: string[] }`
コース作成・更新時の入力値を検証する。

| テストケース | 入力 | 期待する出力 |
|---|---|---|
| 正常（タイトルあり） | `{ title: "React入門" }` | `{ ok: true, errors: [] }` |
| タイトルが空文字 | `{ title: "" }` | `{ ok: false, errors: ["タイトルは必須です"] }` |
| タイトルが空白のみ | `{ title: "   " }` | `{ ok: false, errors: ["タイトルは必須です"] }` |
| タイトルが100文字超 | `{ title: "あ".repeat(101) }` | `{ ok: false, errors: ["タイトルは100文字以内にしてください"] }` |

#### 関数：`validateChapterInput(input): { ok: boolean; errors: string[] }`
章作成・更新時の入力値を検証する。

| テストケース | 入力 | 期待する出力 |
|---|---|---|
| 正常 | `{ title: "第1章", youtubeUrl: "https://youtu.be/abc123" }` | `{ ok: true, errors: [] }` |
| タイトルが空 | `{ title: "", youtubeUrl: "https://youtu.be/abc123" }` | `{ ok: false, errors: ["タイトルは必須です"] }` |
| URL が空 | `{ title: "第1章", youtubeUrl: "" }` | `{ ok: false, errors: ["YouTube URLは必須です"] }` |
| URL が YouTube 以外 | `{ title: "第1章", youtubeUrl: "https://vimeo.com/abc" }` | `{ ok: false, errors: ["YouTube の URL を入力してください"] }` |
| 両方エラー | `{ title: "", youtubeUrl: "" }` | `{ ok: false, errors: ["タイトルは必須です", "YouTube URLは必須です"] }` |

---

### 4. コースの Server Actions
**ファイル：** `src/app/admin/courses/actions.ts`

DBはモックで差し替える。

#### 関数：`createCourse(input)`

| テストケース | 条件 | 期待する動作 |
|---|---|---|
| 正常作成 | 有効なタイトル・説明 | 作成されたコースオブジェクトを返す |
| タイトルなし | title が空 | バリデーションエラーをスロー |
| DB エラー | DB がエラーを返す | エラーをスロー（クラッシュしない） |

#### 関数：`updateCourse(id, input)`

| テストケース | 条件 | 期待する動作 |
|---|---|---|
| 正常更新 | 存在する ID と有効な入力 | 更新後のコースオブジェクトを返す |
| 存在しない ID | DB が 0件更新を返す | エラーをスロー |

#### 関数：`deleteCourse(id)`

| テストケース | 条件 | 期待する動作 |
|---|---|---|
| 正常削除 | 存在する ID | 削除成功のレスポンスを返す |
| 存在しない ID | DB が 0件削除を返す | エラーをスロー |

---

### 5. 章の Server Actions
**ファイル：** `src/app/admin/courses/[courseId]/chapters/actions.ts`

DBはモックで差し替える。

#### 関数：`createChapter(input)`

| テストケース | 条件 | 期待する動作 |
|---|---|---|
| 正常作成 | 有効な入力 | 作成された章オブジェクトを返す |
| YouTube URL 不正 | YouTube 以外の URL | バリデーションエラーをスロー |
| タイトルなし | title が空 | バリデーションエラーをスロー |

#### 関数：`reorderChapters(courseId, orderedIds)`
章の並び順を更新する。

| テストケース | 条件 | 期待する動作 |
|---|---|---|
| 正常並び替え | 有効な ID 配列 | 各章の position が更新される |
| 空配列 | `[]` | 何もせず正常終了 |

---

## テストファイル構成（予定）

```
src/
  lib/
    __tests__/
      youtube.test.ts
      auth-helpers.test.ts
      validation.test.ts
  app/
    admin/
      courses/
        __tests__/
          actions.test.ts
        [courseId]/
          chapters/
            __tests__/
              actions.test.ts
```

---

## モック方針

| モック対象 | 方法 |
|---|---|
| Drizzle DB クライアント | `vi.mock('../../lib/db')` でモジュールごと差し替え |
| Better Auth セッション | テスト用のセッションオブジェクトをそのまま渡す |
| Next.js `revalidatePath` | `vi.mock('next/cache')` で差し替え |

---

## 実行コマンド（予定）

```bash
# 全テスト実行
npx vitest run

# ウォッチモード（開発中）
npx vitest
```
