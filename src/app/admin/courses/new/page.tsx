import { CourseForm } from "@/components/admin/CourseForm";

export default function NewCoursePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">新規コース作成</h1>
      <CourseForm />
    </div>
  );
}
