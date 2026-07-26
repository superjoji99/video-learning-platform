import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Course } from "@/lib/schema";
import Link from "next/link";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        {course.thumbnail && (
          <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-gray-100">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-snug">
              {course.title}
            </CardTitle>
            {course.published === 0 && (
              <Badge variant="secondary" className="shrink-0">
                非公開
              </Badge>
            )}
          </div>
        </CardHeader>
        {course.description && (
          <CardContent>
            <p className="text-sm text-gray-600 line-clamp-2">
              {course.description}
            </p>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
