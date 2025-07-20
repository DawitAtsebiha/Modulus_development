import fs from "fs";
import path from "path";
import LessonViewer from "@/components/LessonViewer";

type Params = {
  params: {
    courseId: string;
    lessonId: string;
    pageId: string;
  };
};

export async function generateStaticParams() {
  const baseDir = path.join(process.cwd(), "content", "lessons");
  const courses = fs.readdirSync(baseDir);
  const allParams: Array<{ courseId: string; lessonId: string; pageId: string }> = [];

  for (const courseId of courses) {
    const lessonsDir = path.join(baseDir, courseId);
    const lessonIds = fs.readdirSync(lessonsDir);

    for (const lessonId of lessonIds) {
      const pagesDir = path.join(lessonsDir, lessonId);
      const pageFiles = fs.readdirSync(pagesDir).filter((f) => f.endsWith(".json"));

      for (const file of pageFiles) {
        const pageId = path.parse(file).name; 
        allParams.push({ courseId, lessonId, pageId });
      }
    }
  }

  return allParams.map(({ courseId, lessonId, pageId }) => ({
    courseId,
    lessonId,
    pageId,
  }));
}

export default function Page({ params }: Params) {
  const { courseId, lessonId, pageId } = params;

  const filePath = path.join(
    process.cwd(),
    "content",
    "lessons",
    courseId,
    lessonId,
    `${pageId}.json`
  );
  const raw = fs.readFileSync(filePath, "utf-8");
  const pageData = JSON.parse(raw) as { title: string; markdown: string };

  return (
    <>
    <LessonViewer title={pageData.title} markdown={pageData.markdown} />
    <div><a href="">TEST</a></div>
    </>
  );
}