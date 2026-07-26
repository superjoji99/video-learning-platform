import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { resolve } from "path";

// .env.local を読み込む
const envPath = resolve(process.cwd(), ".env.local");
const env = Object.fromEntries(
  readFileSync(envPath, "utf-8")
    .split("\n")
    .filter((line) => line.includes("=") && !line.startsWith("#"))
    .map((line) => {
      const [key, ...rest] = line.split("=");
      return [key.trim(), rest.join("=").trim()];
    })
);

const email = process.argv[2];
if (!email) {
  console.error("使い方: node scripts/set-admin.mjs メールアドレス");
  process.exit(1);
}

const client = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

const result = await client.execute({
  sql: "UPDATE user SET role = 'admin' WHERE email = ?",
  args: [email],
});

if (result.rowsAffected === 0) {
  console.error(`ユーザーが見つかりません: ${email}`);
  process.exit(1);
}

console.log(`✅ ${email} を管理者に設定しました`);
client.close();
