import fs from "fs";
import path from "path";
import Link from "next/link";

interface CoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  // Await the params Promise
  const { courseId } = await params;
  
  const courseDir = path.join(
    process.cwd(),
    "content",
    "courses",
    courseId
  );
  
  // Read info.json
  const infoPath = path.join(courseDir, "info.json");
  const infoRaw = fs.readFileSync(infoPath, "utf-8");
  const info = JSON.parse(infoRaw) as { name: string };
  
  // Read lesson directories
  const lessonDirs = fs
    .readdirSync(courseDir)
    .filter((name) =>
      fs.statSync(path.join(courseDir, name)).isDirectory()
    );
  
  // Extract lesson titles from page-1.json
  const lessons = lessonDirs.map((lessonId) => {
    const pagePath = path.join(courseDir, lessonId, "page-1.json");
    const pageRaw = fs.readFileSync(pagePath, "utf-8");
    const page = JSON.parse(pageRaw) as { title: string };
    return { id: lessonId, title: page.title };
  });
  
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">{info.name}</h1>
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