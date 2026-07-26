export const dynamic = "force-dynamic";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import { courses } from "@/lib/schema";
import Link from "next/link";

export default async function AdminCoursesPage() {
  const allCourses = await db.select().from(courses).orderBy(courses.createdAt);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">コース管理</h1>
        <Link href="/admin/courses/new" className={buttonVariants()}>
          + 新規コース作成
        </Link>
      </div>

      {allCourses.length === 0 ? (
        <p className="text-gray-500">コースはまだありません。</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>タイトル</TableHead>
              <TableHead>状態</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.title}</TableCell>
                <TableCell>
                  <Badge
                    variant={course.published === 1 ? "default" : "secondary"}
                  >
                    {course.published === 1 ? "公開中" : "非公開"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Link
                    href={`/admin/courses/${course.id}/chapters/new`}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    章を追加
                  </Link>
                  <Link
                    href={`/admin/courses/${course.id}/edit`}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    編集
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
