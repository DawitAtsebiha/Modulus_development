import fs from "fs";
import path from "path";
import Link from "next/link";

interface CoursePageProps {
  params: { courseId: string };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseId } = await params;


  // grabbing path at which courses live
  const courseMetaPath = path.join(
    process.cwd(),
    "content",
    "lessons",
    courseId,
    "course.json"
  )

  const lessonsRoot = path.join(
    process.cwd(),
    "content",
    "lessons",
    courseId
  );

  const lessonDirs = fs
    .readdirSync(lessonsRoot)
    .filter((name) =>
      fs.statSync(path.join(lessonsRoot, name)).isDirectory()
    );

  const lessons = lessonDirs.map((lessonId) => {
    const pagePath = path.join(
      lessonsRoot,
      lessonId,
      "page-1.json"
    );
    const raw = fs.readFileSync(pagePath, "utf-8");
    const json = JSON.parse(raw) as { title: string };
    return {
      id: lessonId,
      title: json.title,
    };
  });

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Course: {courseId}</h1>
      <ul className="space-y-2">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <Link
              href={`/courses/${courseId}/lessons/${lesson.id}/page-1`}
              className="text-blue-600 hover:underline"
            >
              {lesson.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}